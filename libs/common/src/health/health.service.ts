import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getReadiness(service: string) {
    return {
      service,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
