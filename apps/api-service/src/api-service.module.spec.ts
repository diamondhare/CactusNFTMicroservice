import { Test } from '@nestjs/testing';
import { HealthService } from '@app/common';

import { ApiHealthController } from './health/api-health.controller';

describe('ApiHealthController', () => {
  it('compiles without external infrastructure', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ApiHealthController],
      providers: [HealthService],
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});
