import { Test, TestingModule } from '@nestjs/testing';
import { BrokersController } from './brokers.controller';

describe('BrokersController', () => {
  let controller: BrokersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokersController],
    }).compile();

    controller = module.get<BrokersController>(BrokersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
