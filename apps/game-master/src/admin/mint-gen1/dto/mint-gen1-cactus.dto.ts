import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class MintGen1CactusDto {
  @ApiProperty({ example: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' })
  @IsEthereumAddress()
  to!: string;

  @ApiPropertyOptional({
    description:
      'Optional uint256 genome override. Random V1 traits are generated when omitted.',
    example: '0x0123456789abcdef',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(?:0x[0-9a-fA-F]{1,64}|[0-9]+)$/)
  genome?: string;
}
