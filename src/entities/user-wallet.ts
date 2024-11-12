import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user.js';

@Entity()
export class UserWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne('User', (user: User) => user.accountBalance, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: User;
}
