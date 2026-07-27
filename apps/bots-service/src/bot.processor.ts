import { Logger } from "@nestjs/common";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { RunBotJob } from "@app/queue/types/run-bot-job";
import { BotsQueueService } from "./bot-queue.service";
import { QUEUE_NAMES } from "@app/queue";
import { BotEngine } from "../bot.engine";
import { BotsGateway } from "./bot.gateway";

@Processor(QUEUE_NAMES.BOTS, {
    concurrency: 1,
})
export class BotProcessor extends WorkerHost  {
    private readonly logger = new Logger(BotProcessor.name);

    constructor(
        private readonly botEngine: BotEngine,
        private readonly botsQueueService: BotsQueueService,
        private readonly botGateway: BotsGateway,
    ) {
        super();
    }

    async process(job: Job<RunBotJob>) {
        const botId = job.data.botId;
        this.logger.log(`Starting bot ${botId}...`);

        if (!(await this.botsQueueService.isRunning(botId))) {
            this.logger.log(`Bot ${botId} is stopped; skipping job ${job.id}`);
            return;
        }

        try {
            await this.botEngine.tick(botId, job.id!);
            this.logger.log(`Job completed for bot ${botId}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Bot ${botId} job ${job.id} failed: ${message}`, stack);
            this.botGateway.emitBotError(botId, message);
        } finally {
            try {
                if (await this.botsQueueService.isRunning(botId)) {
                    this.logger.log(`Scheduling next job for bot ${botId}...`);
                    await this.botsQueueService.enqueue(botId, true);
                } else {
                    this.logger.log(`Bot ${botId} is stopped; next job will not be scheduled`);
                }
            } catch (enqueueError) {
                const message = enqueueError instanceof Error ? enqueueError.message : String(enqueueError);
                const stack = enqueueError instanceof Error ? enqueueError.stack : undefined;
                this.logger.error(`Failed to schedule next job for bot ${botId}: ${message}`, stack);
                throw enqueueError;
            }
        }
    }
}