import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CactusesService } from './cactuses.service';

@ApiTags('cactuses')
@Controller('cactuses')
export class CactusesController {
  constructor(private readonly cactusesService: CactusesService) {}

  @Get('owner/:address')
  @ApiOperation({
    summary: 'Get all cactus NFTs and decoded V1 traits owned by an address',
  })
  findOwnedBy(@Param('address') address: string) {
    return this.cactusesService.findOwnedBy(address);
  }
}
