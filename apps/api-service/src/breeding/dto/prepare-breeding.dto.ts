import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PrepareBreedingDto {
  @ApiProperty({ example: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' })
  @IsEthereumAddress()
  breeder!: string;

  @ApiProperty({
    example: '0',
    description: 'Token ID controlled by the breeder',
  })
  @IsNumberString({ no_symbols: true })
  parentA!: string;

  @ApiProperty({
    example: '1',
    description: 'Owned/approved token or a token open for breeding',
  })
  @IsNumberString({ no_symbols: true })
  parentB!: string;

  @ApiPropertyOptional({
    description: 'Optional deterministic genetics salt for testing',
  })
  @IsOptional()
  @IsString()
  salt?: string;

  @ApiPropertyOptional({ default: 3600, minimum: 60, maximum: 86400 })
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(86400)
  validForSeconds?: number;
}
