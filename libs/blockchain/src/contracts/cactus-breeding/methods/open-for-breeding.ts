import { Contract, InterfaceAbi, Wallet } from "ethers";

export async function openForBreeding(tokenId: bigint, cactusBreedingAddress: string, cactusBreedingAbi: InterfaceAbi, botSigner: Wallet): Promise<string> {
    const cactusBreeding = new Contract(
        cactusBreedingAddress,
        cactusBreedingAbi,
        botSigner,
    );
    const openForBreeding = cactusBreeding.getFunction('openForBreeding');
    const tx = await openForBreeding(tokenId);
    const receipt = await tx.wait();

    return receipt?.hash ?? tx.hash;
}