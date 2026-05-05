import {
  AbiCoder,
  AddressLike,
  getBytes,
  keccak256,
  Signer,
} from 'ethers';

const abiCoder = AbiCoder.defaultAbiCoder();

export type BreedSignatureInput = {
  chainId: bigint;
  breedingContract: AddressLike;
  breeder: AddressLike;
  parentA: bigint;
  parentB: bigint;
  childGenome: bigint;
  nonce: bigint;
  deadline: bigint;
};

export type GerminationSignatureInput = {
  chainId: bigint;
  germinationContract: AddressLike;
  owner: AddressLike;
  seedId: bigint;
  nonce: bigint;
  deadline: bigint;
};

export function buildBreedDigest(input: BreedSignatureInput): string {
  return keccak256(
    abiCoder.encode(
      [
        'uint256',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
      ],
      [
        input.chainId,
        input.breedingContract,
        input.breeder,
        input.parentA,
        input.parentB,
        input.childGenome,
        input.nonce,
        input.deadline,
      ],
    ),
  );
}

export function buildGerminationDigest(
  input: GerminationSignatureInput,
): string {
  return keccak256(
    abiCoder.encode(
      ['uint256', 'address', 'address', 'uint256', 'uint256', 'uint256'],
      [
        input.chainId,
        input.germinationContract,
        input.owner,
        input.seedId,
        input.nonce,
        input.deadline,
      ],
    ),
  );
}

export async function signBreedAction(
  signer: Signer,
  input: BreedSignatureInput,
): Promise<string> {
  return signer.signMessage(getBytes(buildBreedDigest(input)));
}

export async function signGerminationAction(
  signer: Signer,
  input: GerminationSignatureInput,
): Promise<string> {
  return signer.signMessage(getBytes(buildGerminationDigest(input)));
}
