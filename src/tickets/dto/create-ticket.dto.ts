import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransportTypeDto } from '../../transport-types/dto/transport-type.dto';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @ValidateNested()
  @Type(() => TransportTypeDto)
  @ApiProperty({
    example: { name: 'flight' },
    type: TransportTypeDto,
  })
  transportType: TransportTypeDto;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Chicago O'Hare" })
  departure: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John F. Kennedy International Airport' })
  arrival: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'AC1713', required: false })
  transportNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '12B', required: false })
  seat?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '27', required: false })
  gate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Self-check-in luggage at counter', required: false })
  luggageInfo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Check-in closes 45 minutes before departure',
    required: false,
  })
  additionalInfo?: string;
}
