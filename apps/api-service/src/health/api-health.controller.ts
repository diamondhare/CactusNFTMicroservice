import { Controller, Get } from '@nestjs/common';
import { HealthService, SERVICE_NAMES } from '@app/common';

@Controller('health')
export class ApiHealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return this.healthService.getReadiness(SERVICE_NAMES.API);
  }
}
