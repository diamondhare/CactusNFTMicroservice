import {
    BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

//Use v7 because it's gigachad verison of default uuid (time-sorted and better for db index performance)
import { v7 as uuidv7 } from "uuid";

@Entity({ name: 'bots-data' })
export class BotsDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'integer' })
  ownedCacti!: number;

  @Column({ type: 'integer' })
  cactiOpenForBreeding!: number;

  @Column({ type: 'varchar', length: 42 })
  walletAddress!: string;

  @Column({ type: 'varchar', length: 66 })
  secretKey!: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  ethBalance!: string;

  //hook for manual creation of id 
  @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}
