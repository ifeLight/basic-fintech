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
import { User } from './user.js';
import {
  TransactionFlow,
  TransactionStatus,
  TransactionType,
} from './interfaces.js';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserTransaction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The ID of transaction',
    example: 'asdf-asdfg-asdf-sdf',
    type: 'string',
  })
  id: string;

  @Column({ type: 'uuid' })
  @ApiProperty()
  userId: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  @ApiProperty()
  amount: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({
    enum: TransactionFlow,
  })
  flow: TransactionFlow;

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

  @ApiProperty({
    required: false,
  })
  @Column({ type: 'varchar', nullable: true })
  reference?: string;

  @ApiProperty({
    required: false,
  })
  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @ApiProperty({
    type: 'string',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    type: User,
    required: false,
  })
  @ManyToOne('User', (user: User) => user.transactions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: User;

  @ApiProperty({
    type: User,
    required: false,
  })
  @OneToOne('User', {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'transferFromId',
    referencedColumnName: 'id',
  })
  transferFrom?: User;

  @ApiProperty({
    type: User,
    required: false,
  })
  @OneToOne('User', {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'transferFromId',
    referencedColumnName: 'id',
  })
  transferTo?: User;
}
