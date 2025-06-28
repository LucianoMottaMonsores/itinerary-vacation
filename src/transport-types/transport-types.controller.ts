import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransportTypesService } from './transport-types.service';
import { CreateTransportTypeDto } from './dto/create-transport-type.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('TransportTypes')
@Controller('transport-types')
export class TransportTypesController {
  constructor(private readonly transportTypesService: TransportTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transport type' })
  @ApiResponse({ status: 201, description: 'Transport type created' })
  async create(@Body() createDto: CreateTransportTypeDto) {
    return this.transportTypesService.createTransportType(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transport types' })
  @ApiResponse({ status: 200, description: 'List of transport types' })
  async findAll() {
    return this.transportTypesService.getAllTransportType();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transport type by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Transport type found' })
  async findOne(@Param('id') id: number) {
    return this.transportTypesService.getTransportType(id);
  }
}
