import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import Decimal from 'decimal.js';
import type { User } from './user.js';
import {
  TransactionFlow,
  TransactionStatus,
  TransactionType,
} from './interfaces.js';

@Entity()
export class UserTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amount: string;

  @Column({ type: 'varchar', nullable: false })
  type: TransactionType;

  @Column({ type: 'varchar', nullable: false })
  status: TransactionStatus;

  flow: string;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  calculateTotalAmount() {
    this.flow = new Decimal(this.amount).gte(0)
      ? TransactionFlow.CREDIT
      : TransactionFlow.DEBIT;
  }

  @Column({ type: 'uuid', nullable: true })
  transferFromId?: string;

  @Column({ type: 'uuid', nullable: true })
  transferToId?: string;

  @Column({ type: 'varchar', nullable: true })
  reference?: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('User', (user: User) => user.transactions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: User;

  @OneToOne('User', {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'transferFromId',
    referencedColumnName: 'id',
  })
  transferFrom?: User;

  @OneToOne('User', {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'transferFromId',
    referencedColumnName: 'id',
  })
  transferTo?: User;
}
