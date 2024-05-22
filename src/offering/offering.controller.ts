import { Body, Controller, Get, Post } from '@nestjs/common';
import { OfferingService } from './offering.service';
import { CreateOfferingDto } from 'src/dto/create-offering.dto';

@Controller('offering')
export class OfferingController {
  constructor(private offeringService: OfferingService) {}

  @Get()
  async getAll(): Promise<string[]> {
    return await this.offeringService.getAll();
  }

  @Post()
  async create(@Body() createOfferingDto: CreateOfferingDto): Promise<string> {
    return await this.offeringService.create(createOfferingDto);
  }
}