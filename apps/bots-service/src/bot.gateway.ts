import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class BotsGateway {
  @WebSocketServer()
  server!: Server;

  emitBotActionStarted(botId: string, action: string, jobId: string) {
    this.server.emit('bot.action', { botId, action, jobId, phase: 'running', timestamp: Date.now() });
  }

  emitBotTick(botId: string, action: string, txHash: string, jobId: string, idleUntil?: number) {
    this.server.emit('bot.tick', {
      botId,
      action,
      txHash,
      jobId,
      phase: 'completed',
      idleUntil,
      timestamp: Date.now(),
    });
  }

  emitBotRuntime(botId: string, running: boolean) {
    this.server.emit('bot.runtime', { botId, running, timestamp: Date.now() });
  }

  emitBotError(botId: string, error: string) {
    this.server.emit('bot.error', {
      botId,
      error,
      timestamp: Date.now(),
    });
  }
}