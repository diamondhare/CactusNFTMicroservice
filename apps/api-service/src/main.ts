import { NestFactory } from '@nestjs/core';

import { ApiServiceModule } from './api-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);
  const port = Number(process.env.API_PORT ?? 3000);

  await app.listen(port);
}

void bootstrap();
