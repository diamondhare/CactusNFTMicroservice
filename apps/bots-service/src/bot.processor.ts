import { Injectable, Logger } from "@nestjs/common";
import { BotEngine } from "../bot.engine";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { RunBotJob } from "@app/queue/types/run-bot-job";
import { BotsQueueService } from "./bot-queue.service";
import { QUEUE_NAMES } from "@app/queue";

@Processor(QUEUE_NAMES.BOTS, {
    concurrency: 1,
})
export class BotProcessor extends WorkerHost  {
    private readonly logger = new Logger(BotProcessor.name);

    constructor(
        private readonly botEngine: BotEngine,
        private readonly botsQueueService: BotsQueueService,
    ) {
        super();
    }

    async process(job: Job<RunBotJob>) {
        this.logger.log(`Starting bot ${job.data.botId}...`);
        await this.botEngine.tick(job.data.botId);
        this.logger.log(`Job completed for bot ${job.data.botId}`);
        this.logger.log(`Starting next job for bot ${job.data.botId}...`);
        await this.botsQueueService.enqueue(job.data.botId);
    }
}