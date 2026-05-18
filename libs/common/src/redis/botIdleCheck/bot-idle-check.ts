import Redis from 'ioredis';

export async function checkBotIdleTime(botId: string): Promise<boolean> {
    const redis = new Redis();
    const botData = await redis.hgetall(`bot:${botId}`);
    await redis.quit();

    if (botData.idleUntil && Date.now() < parseInt(botData.idleUntil)) {
        return true;
    }

    return false;
}