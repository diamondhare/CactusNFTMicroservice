import { Logger } from "@nestjs/common";
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
    try {
        //Get updated nonce manually
        const nonce = await signer.getNonce()
        const tx = await transferFrom(from, to, tokenId, {nonce});
        const receipt = await tx.wait();
        return receipt?.hash ?? tx.hash;
    } catch (error: any) {
        if (error.code) {
            const oldNonce = await signer.getNonce()
            Logger.log(`Nonce error, retrying..`);
            Logger.log(`Old nonce: ${oldNonce}, new nonce ${oldNonce}`);
            const tx = await transferFrom(from, to, tokenId, {nonce: oldNonce});
            const receipt = await tx.wait();
            return receipt?.hash ?? tx.hash;
        }
        console.error("Error occurred while transferring NFT:", error);
        throw error;
    }
}