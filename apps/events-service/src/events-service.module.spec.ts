import { Test } from '@nestjs/testing';

import { EventListenersModule } from './listeners/event-listeners.module';
import { EventProcessorsModule } from './processors/event-processors.module';
import { EventRepositoriesModule } from './repositories/event-repositories.module';

describe('events-service structure', () => {
  it('compiles worker feature modules without external infrastructure', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        EventListenersModule,
        EventProcessorsModule,
        EventRepositoriesModule,
      ],
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});
