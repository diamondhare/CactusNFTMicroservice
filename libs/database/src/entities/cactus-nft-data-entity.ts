import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

//Use v7 because it's gigachad verison of default uuid (time-sorted and better for db index performance)
import { v7 as uuidv7 } from "uuid";

@Entity({ name: 'cactus-nft-data' })
@Unique('UQ_cactus_nft_data_transaction_hash', ['transactionHash', 'cactusTokenId'])
export class CactusNftDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 66 })
  transactionHash!: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  cactusTokenId!: string;

  @Column({ type: 'varchar', length: 42 })
  owner!: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  parentA!: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  parentB!: string;

  @Column({ type: 'integer' })
  generation!: number;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  genome!: string;

  @Column({type: 'boolean'})
  isOpenForBreeding!: boolean;

  //hook for manual creation of id 
  @BeforeInsert()
    generateId() {
        this.id = uuidv7();
    }
}
