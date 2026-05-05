import { Module } from '@nestjs/common';

import { contractAddressesProvider } from './contracts/contract-addresses';
import { hardhatProviderProvider } from './providers/hardhat.provider';

@Module({
  providers: [contractAddressesProvider, hardhatProviderProvider],
  exports: [contractAddressesProvider, hardhatProviderProvider],
})
export class BlockchainModule {}
