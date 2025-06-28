import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('transport_types')
export class TransportType {
  @ApiProperty({ example: 1, description: 'ID do tipo de transporte' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'train', description: 'Nome do tipo de transporte' })
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.transportType)
  tickets: Ticket[];
}
