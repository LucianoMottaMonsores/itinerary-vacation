import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket successfully created.' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'List of tickets.' })
  async findAll() {
    return this.ticketsService.getAllTickets();
  }

  @Get('ordered')
  @ApiOperation({ summary: 'Get tickets ordered into itinerary' })
  @ApiResponse({ status: 200, description: 'Ordered itinerary.' })
  async getOrderedTickets() {
    return this.ticketsService.getOrderedTickets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Ordered itinerary.' })
  async findOne(@Param('id') id: number) {
    return this.ticketsService.getTicket(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Ticket ID to update' })
  @ApiResponse({ status: 200, description: 'Ticket successfully updated.' })
  async updateOne(@Param('id') id: number, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.updateTicket(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket successfully deleted.' })
  async deleteOne(@Param('id') id: number) {
    return this.ticketsService.deleteTicket(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all tickets' })
  @ApiResponse({ status: 200, description: 'All tickets deleted.' })
  async deleteAll() {
    return this.ticketsService.deleteAllTickets();
  }
}
