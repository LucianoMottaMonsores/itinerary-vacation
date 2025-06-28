import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportType } from './entities/transport-type.entity';
import { CreateTransportTypeDto } from './dto/create-transport-type.dto';

@Injectable()
export class TransportTypesService {
  constructor(
    @InjectRepository(TransportType)
    private transportTypeRepository: Repository<TransportType>,
  ) {}

  async createTransportType(createDto: CreateTransportTypeDto): Promise<TransportType> {
    const transportType = this.transportTypeRepository.create(createDto);
    return this.transportTypeRepository.save(transportType);
  }

  async getAllTransportType(): Promise<TransportType[]> {
    return this.transportTypeRepository.find();
  }

  async getTransportType(id: number): Promise<TransportType> {
    const tt = await this.transportTypeRepository.findOneBy({ id });
    if (!tt) throw new NotFoundException(`TransportType with id ${id} not found.`);
    return tt;
  }
}
