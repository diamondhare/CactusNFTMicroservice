import { CactusNftDataEntity } from "@app/database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PersistableTransferEvent } from "../processors/transfer.processor";



@Injectable()
export class TransferEventRepository {
  constructor(
    @InjectRepository(CactusNftDataEntity)
    private readonly repository: Repository<CactusNftDataEntity>,
  ) {}
  
  async update(event: PersistableTransferEvent): Promise<void> {
    await this.repository.update(event.cactusTokenId, {owner: event.to});
  }
}