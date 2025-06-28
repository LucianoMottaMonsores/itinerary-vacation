import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransportTypeDto {
  @IsString()
  @ApiProperty({ example: 'flight' })
  name: string;
}
