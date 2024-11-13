import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import type { UserWallet } from './user-wallet';
import type { UserPassword } from './user-password';
import type { UserTransaction } from './user-transaction';

@Entity()
export class User {
  /**
   * The user's unique identifier
   * @type string
   * @example "f7b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b"
   */
  @ApiProperty({
    example: 'f7b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
    type: 'string',
    description: 'The user unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'The user first name',
    type: 'string',
  })
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The user last name',
    type: 'string',
  })
  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @ApiProperty({
    example: 'John',
    description: 'The user middle name',
    type: 'string',
  })
  @Column({ type: 'varchar', default: '' })
  middleName: string;

  @ApiProperty({
    example: 'abc@mail.com',
    description: 'The user email address',
    type: 'string',
  })
  @Column({ nullable: false, type: 'varchar', unique: true })
  email: string;

  @ApiProperty({
    example: false,
    description: 'The user email verification status',
    type: 'boolean',
  })
  @Column({ nullable: false, default: false })
  emailVerified: boolean;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date the user joined the platform',
    type: 'string',
  })
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne('UserWallet', (userWallet: UserWallet) => userWallet.user, {
    createForeignKeyConstraints: false,
  })
  accountBalance?: UserWallet;

  @OneToOne('UserPassword', (userPassword: UserPassword) => userPassword.user, {
    createForeignKeyConstraints: false,
  })
  password?: UserPassword;

  @OneToMany(
    'UserTransaction',
    (transaction: UserTransaction) => transaction.user,
    {
      createForeignKeyConstraints: false,
    },
  )
  transactions?: UserTransaction;
}
