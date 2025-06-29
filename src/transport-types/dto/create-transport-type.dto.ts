import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTransportTypeDto {
  @ApiProperty({
    example: 'ferry',
    description: 'Name of the type of transport',
  })
  @IsString()
  name: string;
}
