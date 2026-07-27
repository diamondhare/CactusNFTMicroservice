import {
  Contract,
  type ContractTransactionResponse,
  type InterfaceAbi,
  type Wallet,
} from 'ethers';
import type { BreedWithSignatureInput } from '../cactus-breeding.types';

type BreedingWriteContract = {
  breedWithSignature(
    parentA: bigint,
    parentB: bigint,
    childGenome: bigint,
    deadline: bigint,
    backendSignature: string,
    overrides: { value: bigint },
  ): Promise<ContractTransactionResponse>;
};

export async function breedWithSignature(
  input: BreedWithSignatureInput,
  cactusBreedingAddress: string,
  cactusBreedingAbi: InterfaceAbi,
  signer: Wallet,
): Promise<string> {
  const contract = new Contract(
    cactusBreedingAddress,
    cactusBreedingAbi,
    signer,
  ) as unknown as BreedingWriteContract;
  const tx = await contract.breedWithSignature(
    input.parentA,
    input.parentB,
    input.childGenome,
    input.deadline,
    input.backendSignature,
    { value: input.breedingFee },
  );
  const receipt = await tx.wait();
  return receipt?.hash ?? tx.hash;
}
