import { ConfigService } from '@nestjs/config';

export const CONTRACT_ADDRESSES = Symbol('CONTRACT_ADDRESSES');

export type ContractAddresses = {
  cactus721?: string;
  seed721?: string;
  cactusBreeding?: string;
  cactusGermination?: string;
  mockVrf?: string;
};

export const contractAddressesProvider = {
  provide: CONTRACT_ADDRESSES,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ContractAddresses => ({
    cactus721: configService.get<string>('CACTUS_721_ADDRESS') || undefined,
    seed721: configService.get<string>('SEED_721_ADDRESS') || undefined,
    cactusBreeding:
      configService.get<string>('CACTUS_BREEDING_ADDRESS') || undefined,
    cactusGermination:
      configService.get<string>('CACTUS_GERMINATION_ADDRESS') || undefined,
    mockVrf: configService.get<string>('MOCK_VRF_ADDRESS') || undefined,
  }),
};
