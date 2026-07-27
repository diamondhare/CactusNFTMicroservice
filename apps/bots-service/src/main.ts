import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BotsServiceModule } from './bots-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BotsServiceModule, {
    logger: new ConsoleLogger({ colors: true }),
  });
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cactus Bots Service')
    .setDescription('Bot lifecycle, runtime status and autonomous action API')
    .setVersion('1.0')
    .addTag('bots')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'Cactus Bots API',
  });
  await app.listen(process.env.BOTS_PORT ?? process.env.port ?? 3003);
}
void bootstrap();
