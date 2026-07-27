import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GameMasterModule } from './game-master.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GameMasterModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cactus Game Master Service')
    .setDescription('Administrative cactus minting and game management API')
    .setVersion('1.0')
    .addTag('game-master')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'Cactus Game Master API',
  });
  await app.listen(process.env.port ?? 3002);
}
void bootstrap();
