import { formatEther, JsonRpcProvider } from "ethers";
import { HARDHAT_PROVIDER } from "../providers/hardhat.provider";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetEthBalanceByAddress {
    constructor(
        @Inject(HARDHAT_PROVIDER)
        private readonly provider: JsonRpcProvider,
    ) {}
    
    async getBalance(walletAddress: string): Promise<string> {
        try {
            const balance = await this.provider.getBalance(walletAddress);
            return formatEther(balance);
        } catch (error) {
            throw new Error(`Failed to retrieve balance: ${(error as Error).message}`)
        }
    }
}