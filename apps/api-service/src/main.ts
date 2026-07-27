import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { ApiServiceModule } from './api-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);
  const port = Number(process.env.API_PORT ?? 3000);

  app.enableCors({ origin: 'http://localhost:5173' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
}

void bootstrap();
