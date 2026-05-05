import { Test } from '@nestjs/testing';

import { BotJobsModule } from './jobs/bot-jobs.module';
import { BotStrategiesModule } from './strategies/bot-strategies.module';
import { BotWalletsModule } from './wallets/bot-wallets.module';

describe('bots-service structure', () => {
  it('compiles worker feature modules without external infrastructure', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BotStrategiesModule, BotWalletsModule, BotJobsModule],
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});
