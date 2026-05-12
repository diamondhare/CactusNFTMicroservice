import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'open-for-breeding' })
export class OpenForBreedingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 66 })
  transactionHash!: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  cactusTokenId!: string;

  @Column({ type: 'timestamp with time zone' })
  openedAt!: Date;

}
