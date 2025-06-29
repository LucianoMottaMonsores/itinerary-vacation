import { Test, TestingModule } from '@nestjs/testing';
import { TransportTypesService } from './transport-types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransportType } from './entities/transport-type.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTransportTypeDto } from './dto/create-transport-type.dto';

describe('TransportTypesService', () => {
  let service: TransportTypesService;
  let repository: jest.Mocked<Repository<TransportType>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportTypesService,
        {
          provide: getRepositoryToken(TransportType), // Provide a mocked repository using getRepositoryToken
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransportTypesService>(TransportTypesService);
    repository = module.get(getRepositoryToken(TransportType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* Simulate the create and save behavior of the repository
   * Expect the returned result to match the mock
   */
  describe('createTransportType', () => {
    it('should create and save a new transport type', async () => {
      const dto: CreateTransportTypeDto = { name: 'bus' };
      const created = { id: 1, ...dto } as TransportType;

      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);

      const result = await service.createTransportType(dto);

      expect(result).toEqual(created);
      expect(repository.create.bind(repository)).toHaveBeenCalledWith(dto);
      expect(repository.save.bind(repository)).toHaveBeenCalledWith(created);
    });
  });

  // Mock the repository to return a predefined list
  describe('getAllTransportType', () => {
    it('should return all transport types', async () => {
      const allTypes = [
        { id: 1, name: 'flight' },
        { id: 2, name: 'bus' },
      ] as TransportType[];

      repository.find.mockResolvedValue(allTypes);

      const result = await service.getAllTransportType();

      expect(result).toEqual(allTypes);
      expect(repository.find.bind(repository)).toHaveBeenCalled();
    });
  });

  // Simulate successful database lookup
  describe('getTransportType', () => {
    it('should return a transport type by id', async () => {
      const tt = { id: 1, name: 'train' } as TransportType;

      repository.findOneBy.mockResolvedValue(tt);

      const result = await service.getTransportType(1);

      expect(result).toEqual(tt);
      expect(repository.findOneBy.bind(repository)).toHaveBeenCalledWith({ id: 1 });
    });

    // Simulate a failed lookup
    it('should throw NotFoundException if transport type not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.getTransportType(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy.bind(repository)).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
