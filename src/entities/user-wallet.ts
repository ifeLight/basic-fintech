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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserWallet {
  @ApiProperty({
    description: 'The ID of the wallet',
    example: 'asdf-asdfg-asdf-sdf',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: 'asdf-asdfg-asdf-sdf',
    type: 'string',
  })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({
    description: 'The account number',
    example: '1234567890',
    type: 'string',
  })
  @Column({ type: 'varchar' })
  accountNumber: string;

  @ApiProperty({
    description: 'The amount in the wallet',
    example: '1000',
    type: 'string',
  })
  @Column({
    nullable: false,
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amount: string;

  @ApiProperty({
    description: 'The date the wallet was created in ISO format',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date the wallet was last updated in ISO format',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
  })
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
