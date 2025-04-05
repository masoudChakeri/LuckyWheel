import { Test, TestingModule } from '@nestjs/testing';
import { WheelController } from './wheel.controller';
import { WheelService } from './wheel.service';

describe('WheelController', () => {
  let controller: WheelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WheelController],
      providers: [WheelService],
    }).compile();

    controller = module.get<WheelController>(WheelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
