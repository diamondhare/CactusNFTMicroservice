import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider } from 'ethers';

export const HARDHAT_PROVIDER = Symbol('HARDHAT_PROVIDER');

export const hardhatProviderProvider = {
  provide: HARDHAT_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    new JsonRpcProvider(configService.getOrThrow<string>('HARDHAT_RPC_URL')),
};
