import { Test, TestingModule } from '@nestjs/testing';
import { GameMasterController } from './game-master.controller';
import { GameMasterService } from './game-master.service';

describe('GameMasterController', () => {
  let gameMasterController: GameMasterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameMasterController],
      providers: [GameMasterService],
    }).compile();

    gameMasterController = app.get<GameMasterController>(GameMasterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gameMasterController.getHello()).toBe('Hello World!');
    });
  });
});
