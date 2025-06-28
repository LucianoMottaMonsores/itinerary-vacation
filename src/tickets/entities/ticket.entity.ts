import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransportType } from '../../transport-types/entities/transport-type.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tickets')
export class Ticket {
  @ApiProperty({ example: 1, description: 'Unique identifier for the ticket' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'St. Anton am Arlberg Bahnhof',
    description: 'Point of departure',
  })
  @Column()
  departure: string;

  @ApiProperty({ example: 'Innsbruck Hbf', description: 'Point of arrival' })
  @Column()
  arrival: string;

  @ApiProperty({
    example: 'RJX 765',
    required: false,
    description: 'Transport number (e.g. flight number, train number)',
  })
  @Column({ name: 'transport_number', nullable: true })
  transportNumber?: string;

  @ApiProperty({
    example: '17C',
    required: false,
    description: 'Seat assignment',
  })
  @Column({ nullable: true })
  seat?: string;

  @ApiProperty({
    example: 'B32',
    required: false,
    description: 'Gate number for departure',
  })
  @Column({ nullable: true })
  gate?: string;

  @ApiProperty({
    example: 'Self-check-in luggage at counter',
    required: false,
    description: 'Information about luggage handling',
  })
  @Column({ name: 'luggage_info', nullable: true })
  luggageInfo?: string;

  @ApiProperty({
    example: 'Boarding starts 40 minutes before departure.',
    required: false,
    description: 'Any additional instructions or notes',
  })
  @Column({ name: 'additional_info', nullable: true })
  additionalInfo?: string;

  @ApiProperty({
    example: '2025-06-27T14:23:00Z',
    description: 'Timestamp when the ticket was created',
  })
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  /**
   * Relations
   */

  @ApiProperty({
    type: () => TransportType,
    description: 'The type of transport associated with this ticket',
  })
  @ManyToOne(() => TransportType, (type) => type.tickets)
  @JoinColumn({ name: 'transport_type_id' })
  transportType: TransportType;
}
