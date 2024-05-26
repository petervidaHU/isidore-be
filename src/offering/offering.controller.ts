import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { OfferingResponse, OfferingService } from './offering.service';
import { CreateOfferingDto } from 'src/dto/create-offering.dto';

@Controller('offering')
export class OfferingController {
  constructor(private offeringService: OfferingService) {}
 @Get()
async getAll(): Promise<string[]> {
  return await this.offeringService.getAll(); 
}

  @Get('active')
  async getAllActive(): Promise<string[]> {
    return await this.offeringService.getAllActive();
  }

  @Post()
  async create(@Body() createOfferingDto: CreateOfferingDto): Promise<OfferingResponse> {
    return await this.offeringService.create(createOfferingDto);
  }

  @Delete()
  async delete(id: string): Promise<void> {
    return await this.offeringService.delete(id);
  }
}