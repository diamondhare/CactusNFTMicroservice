import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from '@app/common/redis/redis.module';
import { RedisService } from '@app/common/redis/redis.service';

@Module({
  imports: [
    RedisModule,
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        connection: redisService,
      })
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
