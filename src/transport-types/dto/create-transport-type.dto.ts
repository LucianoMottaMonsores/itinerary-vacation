import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTransportTypeDto {
  @ApiProperty({
    example: 'ferry',
    description: 'Name of the type of transport',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
