import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TransportType } from '../transport-types/entities/transport-type.entity';
import { sortTickets } from './helpers/ticket-sorter';
import { formatItinerary } from './helpers/format-itinerary';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TransportType)
    private transportTypeRepository: Repository<TransportType>,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { transportType, ...rest } = createTicketDto;

    const foundTransportType = await this.transportTypeRepository.findOne({
      where: { name: transportType.name },
    });

    if (!foundTransportType) {
      throw new NotFoundException('Transport type not found');
    }

    const ticket = this.ticketsRepository.create({
      ...rest,
      transportType: foundTransportType,
    });

    return this.ticketsRepository.save(ticket);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoin('ticket.transportType', 'transportType')
      .select([
        'ticket', //return all columns of ticket table
        'transportType.name',
      ])
      .getMany();
  }

  async getTicket(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoin('ticket.transportType', 'transportType')
      .select([
        'ticket', //return all columns of ticket table
        'transportType.name',
      ])
      .where('ticket.id = :id', { id })
      .getOne();

    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not found.`);
    return ticket;
  }

  async getOrderedTickets(): Promise<string> {
    const tickets = await this.ticketsRepository.find({
      relations: ['transportType'],
    });

    if (tickets.length === 0) {
      return 'No travel itinerary found. Please add tickets to generate a route.';
    }
    const sortedTickets = sortTickets(tickets); // algorithm to sort tickets into a logical travel sequence
    const itinerary = formatItinerary(sortedTickets); // formats the result into readable itinerary list
    return itinerary.join('\n');
  }

  async updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found.`);
    }

    const { transportType, ...obj } = updateTicketDto; // Destructure the transportType from the DTO; store remaining properties in 'obj'
    const updateData: Partial<Ticket> = { ...obj }; // Initialize an object to hold the data that will be updated

    // If a new transportType is provided, find it in the database by name
    if (transportType && transportType.name) {
      const foundTransportType = await this.transportTypeRepository.findOne({
        where: { name: transportType.name },
      });

      if (!foundTransportType) {
        throw new NotFoundException(`Transport type '${transportType.name}' not found.`);
      }

      updateData.transportType = foundTransportType;
    }

    await this.ticketsRepository.update(id, updateData);

    const updated = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['transportType'],
    });

    if (!updated) {
      throw new NotFoundException(`Ticket with ID ${id} not found after update.`);
    }

    return updated;
  }

  async deleteTicket(id: number): Promise<void> {
    await this.ticketsRepository.delete(id);
  }

  async deleteAllTickets(): Promise<void> {
    await this.ticketsRepository.clear();
  }
}
