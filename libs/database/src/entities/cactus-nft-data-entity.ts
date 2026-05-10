import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'cactus-nft-data' })
@Unique('UQ_cactus_nft_data_transaction_hash', ['transactionHash'])
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

}
