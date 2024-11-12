import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LastGeneratedAccountNumber {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
