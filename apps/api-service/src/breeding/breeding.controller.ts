import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BreedingService } from './breeding.service';
import { PrepareBreedingDto } from './dto/prepare-breeding.dto';

@ApiTags('breeding')
@Controller('breeding')
export class BreedingController {
  constructor(private readonly breedingService: BreedingService) {}

  @Post('prepare')
  @ApiOperation({
    summary:
      'Generate child genome and backend signature for breedWithSignature',
  })
  prepare(@Body() dto: PrepareBreedingDto) {
    return this.breedingService.prepare(dto);
  }
}
