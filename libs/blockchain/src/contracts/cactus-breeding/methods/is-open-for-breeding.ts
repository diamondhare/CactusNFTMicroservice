import { Contract, InterfaceAbi, Wallet } from "ethers";

export async function isOpenForBreeding(tokenId: bigint, cactusBreedingAddress: string, cactusBreedingAbi: InterfaceAbi, botSigner: Wallet): Promise<boolean> {
    const cactusBreeding = new Contract(
        cactusBreedingAddress,
        cactusBreedingAbi,
        botSigner,
    );
    const isOpenForBreeding = cactusBreeding.getFunction('isOpenForBreeding');
    return await isOpenForBreeding(tokenId);
}