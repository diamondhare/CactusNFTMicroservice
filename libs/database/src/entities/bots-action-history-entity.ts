import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

//Use v7 because it's gigachad verison of default uuid (time-sorted and better for db index performance)
import { v7 as uuidv7 } from "uuid";

@Entity({ name: 'bots-action-history' })
export class BotsActionHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  botId!: string;

  @Column({ type: 'varchar', length: 42 })
  action!: string;

  @Column({ type: 'varchar', length: 66 })
  transactionHash!: string;

  @Column({ type: 'varchar', length: 60 })
  jobId!: string;

  //hook for manual creation of id 
  @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}
