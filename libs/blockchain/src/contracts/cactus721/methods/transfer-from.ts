import { Contract, InterfaceAbi, Wallet } from "ethers";


export async function transferFrom(
    from: string,
    to: string,
    tokenId: bigint,
    cactus721Address: string,
    cactus721Abi: InterfaceAbi,
    signer: Wallet
): Promise<string> {
    const cactus721 = new Contract(
        cactus721Address,
        cactus721Abi,
        signer,
    );
    const transferFrom = cactus721.getFunction('transferFrom');
    const tx = await transferFrom(from, to, tokenId);
    const receipt = await tx.wait();
    return receipt?.hash ?? tx.hash;
}