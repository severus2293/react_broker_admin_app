import { Test, TestingModule } from '@nestjs/testing';
import { BargainProcessController } from './bargain_process.controller';

describe('BargainProcessController', () => {
  let controller: BargainProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BargainProcessController],
    }).compile();

    controller = module.get<BargainProcessController>(BargainProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
