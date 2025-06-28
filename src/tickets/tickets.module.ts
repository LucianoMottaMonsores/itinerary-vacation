import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TransportType } from '../transport-types/entities/transport-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TransportType])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
