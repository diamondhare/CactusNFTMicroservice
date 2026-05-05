import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'seed_minted_events' })
@Unique('UQ_seed_minted_events_tx_log', ['transactionHash', 'logIndex'])
export class SeedMintedEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 42 })
  contractAddress!: string;

  @Column({ type: 'varchar', length: 66 })
  transactionHash!: string;

  @Column({ type: 'integer' })
  logIndex!: number;

  @Column({ type: 'integer' })
  blockNumber!: number;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  seedTokenId!: string;

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

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  germinationChanceBps!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
