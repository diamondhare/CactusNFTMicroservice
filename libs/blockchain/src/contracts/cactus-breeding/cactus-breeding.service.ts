import { Inject, Injectable } from "@nestjs/common";
import { CONTRACT_ADDRESSES, type ContractAddresses } from "@app/blockchain";
import { CACTUS_BREEDING_ABI } from "@app/blockchain/abis/cactus-breeding.abi";
import { Wallet } from "ethers";
import { openForBreeding } from "./methods/open-for-breeding";
import { closeForBreeding } from "./methods/close-for-breeding";
import { isOpenForBreeding } from "./methods/is-open-for-breeding";

@Injectable()
export class CactusBreedingService {
    constructor(
        @Inject(CONTRACT_ADDRESSES)
        private readonly contractAddresses: ContractAddresses,
    ) {}

    async openForBreeding(tokenId: bigint): Promise<string> {
        if(this.contractAddresses.cactusBreeding === undefined) {
            throw new Error('CACTUS_BREEDING_ADDRESS is not configured');
        }

        // return await openForBreeding(tokenId, this.contractAddresses.cactusBreeding, CACTUS_BREEDING_ABI, this.signer);
        return "0x"; // Placeholder until openForBreeding method is implemented
    }

    async closeForBreeding(tokenId: bigint): Promise<string> {
        if(this.contractAddresses.cactusBreeding === undefined) {
            throw new Error('CACTUS_BREEDING_ADDRESS is not configured');
        }
        return "0x"; // Placeholder until closeForBreeding method is implemented
        // return await closeForBreeding(tokenId, this.contractAddresses.cactusBreeding, CACTUS_BREEDING_ABI, this.signer);
    }

    async isOpenForBreeding(tokenId: bigint): Promise<boolean> {
        if(this.contractAddresses.cactusBreeding === undefined) {
            throw new Error('CACTUS_BREEDING_ADDRESS is not configured');
        }
        
    //    return await isOpenForBreeding(tokenId, this.contractAddresses.cactusBreeding, CACTUS_BREEDING_ABI, this.signer);
        return true;
    }   
}