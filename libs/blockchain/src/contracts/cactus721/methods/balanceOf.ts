import { Contract, InterfaceAbi, Wallet } from "ethers";

export async function balanceOf(owner: string, cactus721Address: string, cactus721Abi: InterfaceAbi, signer: Wallet): Promise<number> {
    const cactus721 = new Contract(
        cactus721Address,
        cactus721Abi,
        signer
    );
    const balanceOf = cactus721.getFunction('balanceOf');
    return await balanceOf(owner);
}