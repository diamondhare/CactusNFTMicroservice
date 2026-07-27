import { Inject, Injectable, Logger } from "@nestjs/common";
import { approve } from "./methods/approve";
import { transferFrom } from "./methods/transfer-from";
import { Contract, ContractTransactionResponse, Wallet } from "ethers";
import { CONTRACT_ADDRESSES, type ContractAddresses } from "../contract-addresses";
import { CACTUS_721_ABI } from "../abis/cactus721.abi";

@Injectable()
export class Cactus721Service {
    constructor(
        // @Inject(CONTRACT_ADDRESSES)
        // private readonly cactus721Address: ContractAddresses["cactus721"],
        @Inject(CONTRACT_ADDRESSES)
        private readonly contractAddresses: ContractAddresses,
    ) {}

    private readonly cactus721Abi = CACTUS_721_ABI;
    
    async transfer(from: string, to: string, tokenId: bigint, signer: Wallet): Promise<string> {
        if (this.contractAddresses.cactus721 === undefined) {
            throw new Error('CACTUS_721_ADDRESS is not configured');
        }
       return await transferFrom(from, to, tokenId, this.contractAddresses.cactus721, this.cactus721Abi, signer);
    }

    async approve(to: string, tokenId: bigint, signer: Wallet): Promise<string> {
        Logger.log(`Here in approve function of Cactus721Service with to: ${to}, tokenId: ${tokenId} and signer address: ${signer.address}`);
        if (this.contractAddresses.cactus721 === undefined) {
            throw new Error('CACTUS_721_ADDRESS is not configured');
        }
        Logger.log(`Approving tokenId ${tokenId} to ${to} on contract ${this.contractAddresses.cactus721}`);
        
        // const approveTx = await approve(tokenId, to, this.contractAddresses.cactus721, this.cactus721Abi, signer);
        const cactus721 = new Contract(
                this.contractAddresses.cactus721,
                this.cactus721Abi,
                signer,
            );
            Logger.log(`BBBBBBBBBBB`);
                const approve = cactus721.getFunction('approve');
                Logger.log(`Owner of tokenId ${tokenId} before approval: ${await cactus721.ownerOf(tokenId)}`);
                Logger.log(`Bot address: ${await signer.getAddress()}`);
                const tx = (await approve(to, tokenId)) as ContractTransactionResponse;
                const receipt = await tx.wait();
        
                return receipt?.hash ?? tx.hash;
        // console.log("approve tx: " + approveTx);
        // return approveTx;
    } 

    async mintGenesisCactus(to: string): Promise<void> {
        // Implement the logic to mint a new Genesis Cactus NFT and assign it to 'to'
        // This might involve interacting with a blockchain or a database
    }

    async mintGen1Cactus(to: string): Promise<void> {
        // Implement the logic to mint a new Gen1 Cactus NFT and assign it to 'to'
        // This might involve interacting with a blockchain or a database
    }

    async ownerOf(tokenId: bigint, signer: Wallet): Promise<string> {
        if (this.contractAddresses.cactus721 === undefined) {
            throw new Error("CACTUS_721_ADDRESS is not configured");
        }
        const cactus721 = new Contract(
            this.contractAddresses.cactus721,
            this.cactus721Abi,
            signer,
        );
        return await cactus721.ownerOf(tokenId);
    }
}