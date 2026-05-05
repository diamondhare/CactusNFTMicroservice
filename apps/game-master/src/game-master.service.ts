import { Injectable } from '@nestjs/common';

@Injectable()
export class GameMasterService {
  getHello(): string {
    return 'Hello World!';
  }
}
