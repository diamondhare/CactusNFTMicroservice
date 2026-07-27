import { decodeCactusGenomeV1 } from '@app/blockchain';
import { CactusNftDataEntity } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getAddress } from 'ethers';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CactusesService {
  constructor(
    @InjectRepository(CactusNftDataEntity)
    private readonly repository: Repository<CactusNftDataEntity>,
  ) {}

  async findOwnedBy(address: string) {
    let owner: string;
    try {
      owner = getAddress(address);
    } catch {
      throw new BadRequestException('Invalid Ethereum address');
    }

    const cactuses = await this.repository.find({
      where: { owner: ILike(owner) },
      order: { cactusTokenId: 'ASC' },
    });

    return {
      owner,
      total: cactuses.length,
      cactuses: cactuses.map((cactus) => ({
        tokenId: cactus.cactusTokenId,
        owner: cactus.owner,
        generation: cactus.generation,
        genome: `0x${BigInt(cactus.genome).toString(16).padStart(64, '0')}`,
        parentA: cactus.parentA,
        parentB: cactus.parentB,
        isOpenForBreeding: cactus.isOpenForBreeding,
        transactionHash: cactus.transactionHash,
        traits: decodeCactusGenomeV1(BigInt(cactus.genome)),
      })),
    };
  }
}
