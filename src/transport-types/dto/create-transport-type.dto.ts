import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransportTypeDto {
  @ApiProperty({
    example: 'ferry',
    description: 'Name of the type of transport',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
