import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TransportType } from '../transport-types/entities/transport-type.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { sortTickets } from './helpers/ticket-sorter';
import { formatItinerary } from './helpers/format-itinerary';
import { CreateTicketDto } from './dto/create-ticket.dto';

jest.mock('./helpers/ticket-sorter');
jest.mock('./helpers/format-itinerary');

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketsRepository: jest.Mocked<Repository<Ticket>>;
  let transportTypeRepository: jest.Mocked<Repository<TransportType>>;

  type MockQueryBuilder<T> = {
    leftJoin: jest.Mock<MockQueryBuilder<T>, [string, string]>;
    select: jest.Mock<MockQueryBuilder<T>, [string[]]>;
    where: jest.Mock<MockQueryBuilder<T>, [string, any]>;
    getMany: jest.Mock<Promise<T[]>>;
    getOne: jest.Mock<Promise<T | undefined>>;
  };

  let mockQueryBuilder: MockQueryBuilder<Ticket>;

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    } as unknown as MockQueryBuilder<Ticket>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn(),
            createQueryBuilder: jest.fn().mockImplementation(() => mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(TransportType),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketsRepository = module.get(getRepositoryToken(Ticket));
    transportTypeRepository = module.get(getRepositoryToken(TransportType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    it('should create and return a ticket', async () => {
      const dto: CreateTicketDto = {
        departure: 'A',
        arrival: 'B',
        seat: '12A',
        transportType: { name: 'train' },
      };
      const transportType = {
        id: 1,
        name: 'train',
        tickets: [],
      } as TransportType;
      const createdTicket = { id: 1, ...dto, transportType };

      transportTypeRepository.findOne.mockResolvedValue(transportType);
      ticketsRepository.create.mockReturnValue(createdTicket);
      ticketsRepository.save.mockResolvedValue(createdTicket);

      const result = await service.createTicket(dto);

      expect(result).toEqual(createdTicket);
    });

    it('should throw if transportType not found', async () => {
      const dto: CreateTicketDto = {
        departure: 'A',
        arrival: 'B',
        transportType: { name: 'unknown' },
      };
      transportTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.createTicket(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllTickets', () => {
    it('should return all tickets', async () => {
      const tickets = [{ id: 1 }, { id: 2 }] as Ticket[];
      mockQueryBuilder.getMany.mockResolvedValue(tickets);

      const result = await service.getAllTickets();

      expect(result).toEqual(tickets);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ticketsRepository.createQueryBuilder).toHaveBeenCalledWith('ticket');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'ticket.transportType',
        'transportType',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(['ticket', 'transportType.name']);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('getTicket', () => {
    it('should return a ticket', async () => {
      const ticket = { id: 1 } as Ticket;
      mockQueryBuilder.getOne.mockResolvedValue(ticket);

      const result = await service.getTicket(1);

      expect(result).toEqual(ticket);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ticketsRepository.createQueryBuilder).toHaveBeenCalledWith('ticket');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'ticket.transportType',
        'transportType',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(['ticket', 'transportType.name']);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('ticket.id = :id', {
        id: 1,
      });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should throw if ticket not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(undefined);

      await expect(service.getTicket(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrderedTickets', () => {
    it('should return formatted itinerary', async () => {
      const tickets = [{ id: 1 }, { id: 2 }] as Ticket[];
      const sorted = [{ id: 2 }, { id: 1 }] as Ticket[];
      const itinerary = ['Take flight from A to B', 'Take flight from B to C'];

      ticketsRepository.find.mockResolvedValue(tickets);
      (sortTickets as jest.Mock).mockReturnValue(sorted);
      (formatItinerary as jest.Mock).mockReturnValue(itinerary);

      const result = await service.getOrderedTickets();
      expect(result).toEqual(itinerary);
    });
  });

  describe('updateTicket', () => {
    it('should update and return ticket', async () => {
      const existing = { id: 1 } as Ticket;
      const transportType = mockTransportType(2, 'bus');
      const updated = { id: 1, transportType } as Ticket;

      ticketsRepository.findOneBy.mockResolvedValue(existing);
      transportTypeRepository.findOne.mockResolvedValue(transportType);
      ticketsRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateTicket(1, {
        transportType: { name: 'bus' },
      });
      expect(result).toEqual(updated);
    });

    it('should throw if ticket not found', async () => {
      ticketsRepository.findOneBy.mockResolvedValue(null);
      await expect(service.updateTicket(999, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw if transport type not found', async () => {
      ticketsRepository.findOneBy.mockResolvedValue({ id: 1 } as Ticket);
      transportTypeRepository.findOne.mockResolvedValue(null);
      await expect(service.updateTicket(1, { transportType: { name: 'invalid' } })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if ticket not found after update', async () => {
      ticketsRepository.findOneBy.mockResolvedValue({ id: 1 } as Ticket);
      transportTypeRepository.findOne.mockResolvedValue({
        name: 'bus',
      } as TransportType);
      ticketsRepository.findOne.mockResolvedValue(null);

      await expect(service.updateTicket(1, { transportType: { name: 'bus' } })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket', async () => {
      await service.deleteTicket(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ticketsRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteAllTickets', () => {
    it('should clear all tickets', async () => {
      await service.deleteAllTickets();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(ticketsRepository.clear).toHaveBeenCalled();
    });
  });
});

function mockTransportType(id: number, name: string): TransportType {
  return { id, name, tickets: [] } as TransportType;
}
