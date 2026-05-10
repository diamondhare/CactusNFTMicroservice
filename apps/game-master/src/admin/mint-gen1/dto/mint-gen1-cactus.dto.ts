import { IsEthereumAddress, IsString } from 'class-validator';

export class MintGen1CactusDto {
  @IsEthereumAddress()
  to!: string;

  @IsString()
  genome!: string;
}
