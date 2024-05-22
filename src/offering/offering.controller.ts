import { Controller, Get, Post } from '@nestjs/common';
import { OfferingService } from './offering.service';

@Controller('offering')
export class OfferingController {
  constructor(private offeringService: OfferingService) {}

  @Get()
  getAll(): string[] {
    return this.offeringService.getAll();
  }

  @Post()
  create(): string {
    return this.offeringService.create('Sample offering');
  }
}