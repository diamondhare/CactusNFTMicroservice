import { NestFactory } from '@nestjs/core';
import { GameMasterModule } from './game-master.module';

async function bootstrap() {
  const app = await NestFactory.create(GameMasterModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
