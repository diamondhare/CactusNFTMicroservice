import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SERVICE_NAMES } from '@app/common';

import { EventsServiceModule } from './events-service.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(EventsServiceModule);
  const logger = app.get(Logger);

  logger.log(`${SERVICE_NAMES.EVENTS} is ready`);
}

void bootstrap();
