import { Contract, InterfaceAbi, Wallet } from "ethers";


export async function approve(
    tokenId: bigint,
    to: string,
    cactus721Address: string, 
    cactus721Abi: InterfaceAbi, 
    signer: Wallet
): Promise<string> {
    const cactus721 = new Contract(
        cactus721Address,
        cactus721Abi,
        signer,
    );
    const approve = cactus721.getFunction('approve');
    const tx = await approve(to, tokenId);
    const receipt = await tx.wait();

    return receipt?.hash ?? tx.hash;
}