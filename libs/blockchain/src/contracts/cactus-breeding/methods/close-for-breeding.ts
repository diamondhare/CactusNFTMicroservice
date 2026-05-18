import { Contract, InterfaceAbi, Wallet } from "ethers";

export async function closeForBreeding(tokenId: bigint, cactusBreedingAddress: string, cactusBreedingAbi: InterfaceAbi, botSigner: Wallet): Promise<string> {
    const cactusBreeding = new Contract(
        cactusBreedingAddress,
        cactusBreedingAbi,
        botSigner,
    );
    const closeForBreeding = cactusBreeding.getFunction('closeForBreeding');
    const tx = await closeForBreeding(tokenId);
    const receipt = await tx.wait();

    return receipt?.hash ?? tx.hash;
}