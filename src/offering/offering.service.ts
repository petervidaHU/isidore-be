import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferingService {
  getAll(): string[] {
    return ['Offering 1', 'Offering 2', 'Offering 3'];
  }

  create(offering: string): string {
    return `Created offering: ${offering}`;
  }
}