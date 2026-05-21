import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnApplicationShutdown {
    private readonly logger = new Logger(RedisService.name);

    constructor(private configService: ConfigService) {
        super({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            maxRetriesPerRequest:null,
        })

        this.on('connect', () => this.logger.log('Connected to Redis'));
        this.on('error', (err) => this.logger.error('Redis client error: ', err));
    }
    onApplicationShutdown() {
        this.disconnect();
        this.logger.log('Redis connection closed');
    }
}