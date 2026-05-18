import Redis from 'ioredis';

export async function setBotIdleTime(botId: string, idleTime: number): Promise<void> {
    const redis = new Redis();
    await redis.hset(`bot:${botId}`, {
        idleUntil: Date.now() + idleTime,
        status: 'idle'
    });
    await redis.quit();
}