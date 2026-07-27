import { randomBytes } from 'node:crypto';
import {
  CONTRACT_ADDRESSES,
  HARDHAT_PROVIDER,
  breedCactusGenomeV1,
  signBreedAction,
  type ContractAddresses,
} from '@app/blockchain';
import { CACTUS_721_ABI } from '@app/blockchain/abis/cactus721.abi';
import { CACTUS_BREEDING_ABI } from '@app/blockchain/abis/cactus-breeding.abi';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Contract, JsonRpcProvider, Wallet, getAddress } from 'ethers';

import { PrepareBreedingDto } from './dto/prepare-breeding.dto';

type CactusDataResult = {
  0: bigint;
  3: bigint;
  genome: bigint;
  generation: bigint;
};

type CactusReadContract = {
  cactusData(tokenId: bigint): Promise<CactusDataResult>;
  ownerOf(tokenId: bigint): Promise<string>;
  getApproved(tokenId: bigint): Promise<string>;
  isApprovedForAll(owner: string, operator: string): Promise<boolean>;
};

type BreedingReadContract = {
  isOpenForBreeding(tokenId: bigint): Promise<boolean>;
  breedingNonces(account: string): Promise<bigint>;
  breedingFee(): Promise<bigint>;
  BACKEND_SIGNER_ROLE(): Promise<string>;
  hasRole(role: string, account: string): Promise<boolean>;
};

@Injectable()
export class BreedingService {
  private readonly signer: Wallet;

  constructor(
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
    @Inject(HARDHAT_PROVIDER)
    private readonly provider: JsonRpcProvider,
    configService: ConfigService,
  ) {
    this.signer = new Wallet(
      configService.getOrThrow<string>('GAME_MASTER_PRIVATE_KEY'),
      provider,
    );
  }

  async prepare(dto: PrepareBreedingDto) {
    const cactusAddress = this.requireAddress(
      this.contractAddresses.cactus721,
      'CACTUS_721_ADDRESS',
    );
    const breedingAddress = this.requireAddress(
      this.contractAddresses.cactusBreeding,
      'CACTUS_BREEDING_ADDRESS',
    );
    const breeder = getAddress(dto.breeder);
    const parentA = this.parseTokenId(dto.parentA, 'parentA');
    const parentB = this.parseTokenId(dto.parentB, 'parentB');
    if (parentA === parentB) {
      throw new BadRequestException(
        'parentA and parentB must be different tokens',
      );
    }

    const cactus = new Contract(
      cactusAddress,
      CACTUS_721_ABI,
      this.provider,
    ) as unknown as CactusReadContract;
    const breeding = new Contract(
      breedingAddress,
      CACTUS_BREEDING_ABI,
      this.provider,
    ) as unknown as BreedingReadContract;

    const [
      dataA,
      dataB,
      ownerA,
      ownerB,
      parentBIsOpen,
      nonce,
      breedingFee,
      network,
      latestBlock,
      backendSignerRole,
    ] = await Promise.all([
      cactus.cactusData(parentA),
      cactus.cactusData(parentB),
      cactus.ownerOf(parentA),
      cactus.ownerOf(parentB),
      breeding.isOpenForBreeding(parentB),
      breeding.breedingNonces(breeder),
      breeding.breedingFee(),
      this.provider.getNetwork(),
      this.provider.getBlock('latest'),
      breeding.BACKEND_SIGNER_ROLE(),
    ]);

    const [parentAAllowed, parentBAllowed, signerHasRole] = await Promise.all([
      this.canUseParent(cactus, parentA, getAddress(ownerA), breeder),
      parentBIsOpen
        ? Promise.resolve(true)
        : this.canUseParent(cactus, parentB, getAddress(ownerB), breeder),
      breeding.hasRole(backendSignerRole, this.signer.address),
    ]);

    if (!parentAAllowed) {
      throw new ForbiddenException(
        'Breeder does not own or have approval for parentA',
      );
    }
    if (!parentBAllowed) {
      throw new ForbiddenException(
        'parentB is neither approved nor open for breeding',
      );
    }
    if (!signerHasRole) {
      throw new ForbiddenException(
        'Configured game-master signer lacks BACKEND_SIGNER_ROLE',
      );
    }

    const parentAGenome = dataA.genome ?? dataA[0];
    const parentBGenome = dataB.genome ?? dataB[0];
    const parentAGeneration = Number(dataA.generation ?? dataA[3]);
    const parentBGeneration = Number(dataB.generation ?? dataB[3]);
    const salt = dto.salt ?? `breed:${randomBytes(32).toString('hex')}`;
    const child = breedCactusGenomeV1({
      parentAGenome,
      parentBGenome,
      parentAGeneration,
      parentBGeneration,
      salt,
    });
    const deadline =
      BigInt(latestBlock?.timestamp ?? Math.floor(Date.now() / 1000)) +
      BigInt(dto.validForSeconds ?? 3_600);
    const signature = await signBreedAction(this.signer, {
      chainId: network.chainId,
      breedingContract: breedingAddress,
      breeder,
      parentA,
      parentB,
      childGenome: child.genomeBigInt,
      nonce,
      deadline,
    });

    return {
      breedingContract: breedingAddress,
      breeder,
      parentA: parentA.toString(),
      parentB: parentB.toString(),
      childGenome: child.genomeHex,
      childGeneration: child.generation,
      childTraits: child.traits,
      entropy: child.entropy,
      salt,
      nonce: nonce.toString(),
      deadline: deadline.toString(),
      breedingFee: breedingFee.toString(),
      backendSignature: signature,
    };
  }

  private async canUseParent(
    cactus: CactusReadContract,
    tokenId: bigint,
    owner: string,
    breeder: string,
  ): Promise<boolean> {
    if (owner === breeder) return true;
    const [approved, approvedForAll] = await Promise.all([
      cactus.getApproved(tokenId),
      cactus.isApprovedForAll(owner, breeder),
    ]);
    return getAddress(approved) === breeder || approvedForAll;
  }

  private parseTokenId(value: string, field: string): bigint {
    try {
      const tokenId = BigInt(value);
      if (tokenId < 0n) throw new Error('negative');
      return tokenId;
    } catch {
      throw new BadRequestException(`${field} must be a non-negative integer`);
    }
  }

  private requireAddress(value: string | undefined, name: string): string {
    if (value === undefined) throw new Error(`${name} is not configured`);
    return getAddress(value);
  }
}
