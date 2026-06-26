import { Contract, ContractTransactionResponse, InterfaceAbi, Wallet } from "ethers";


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
    // console.log(`Approving tokenId ${tokenId} to ${to} on contract ${cactus721Address}`);
    try {
        const approve = cactus721.getFunction('approve');
        const tx = (await approve(to, tokenId)) as ContractTransactionResponse;
        const receipt = await tx.wait();

        return receipt?.hash ?? tx.hash;
    } catch (error) {
        console.error("Error occurred while approving NFT:", error);
        throw error;
    }
}