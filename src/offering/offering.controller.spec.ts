import { Test, TestingModule } from '@nestjs/testing';
import { OfferingController } from './offering.controller';

describe('OfferingController', () => {
  let controller: OfferingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferingController],
    }).compile();

    controller = module.get<OfferingController>(OfferingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
