import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransportTypeDto } from '../../transport-types/dto/transport-type.dto';

export class UpdateTicketDto {
  @IsOptional()
  departure?: string;

  @IsOptional()
  arrival?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TransportTypeDto)
  transportType?: TransportTypeDto;
}
