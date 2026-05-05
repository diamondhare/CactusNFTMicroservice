import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SERVICE_NAMES } from '@app/common';

import { BotsServiceModule } from './bots-service.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BotsServiceModule);
  const logger = app.get(Logger);

  logger.log(`${SERVICE_NAMES.BOTS} is ready`);
}

void bootstrap();
