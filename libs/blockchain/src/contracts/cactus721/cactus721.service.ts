import { Inject, Injectable } from "@nestjs/common";
import { approve } from "./methods/approve";
import { transferFrom } from "./methods/transfer-from";
import { Wallet } from "ethers";
import { CONTRACT_ADDRESSES, type ContractAddresses } from "../contract-addresses";
import { CACTUS_721_ABI } from "../abis/cactus721.abi";

@Injectable()
export class Cactus721Service {
    constructor(
        @Inject(CONTRACT_ADDRESSES)
        private readonly cactus721Address: ContractAddresses["cactus721"],
    ) {}

    private readonly cactus721Abi = CACTUS_721_ABI;
    
    async transfer(from: string, to: string, tokenId: bigint, signer: Wallet): Promise<string> {
        if (this.cactus721Address === undefined) {
            throw new Error('CACTUS_721_ADDRESS is not configured');
        }
       return await transferFrom(from, to, tokenId, this.cactus721Address, this.cactus721Abi, signer);
    }

    async approve(to: string, tokenId: bigint, signer: Wallet): Promise<string> {
        if (this.cactus721Address === undefined) {
            throw new Error('CACTUS_721_ADDRESS is not configured');
        }
        return await approve(tokenId, to, this.cactus721Address, this.cactus721Abi, signer);
    } 

    async mintGenesisCactus(to: string): Promise<void> {
        // Implement the logic to mint a new Genesis Cactus NFT and assign it to 'to'
        // This might involve interacting with a blockchain or a database
    }

    async mintGen1Cactus(to: string): Promise<void> {
        // Implement the logic to mint a new Gen1 Cactus NFT and assign it to 'to'
        // This might involve interacting with a blockchain or a database
    }

    async ownerOf(tokenId: bigint): Promise<string> {
        // Implement the logic to retrieve the owner of the NFT with the given tokenId
        // This might involve interacting with a blockchain or a database
        return "ownerAddress"; // Placeholder return value
    }
}