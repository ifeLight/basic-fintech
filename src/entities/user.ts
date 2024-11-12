import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', default: '' })
  middleName: string;

  /**
   * The user's email address
   * @type string
   * @example "abc@basic-fitech.com"
   */
  @Column({ nullable: false, type: 'varchar' })
  email: string;

  /**
   * If the user's email address has been verified
   * @type boolean
   * @example true
   */
  @Column({ nullable: false, default: false })
  emailVerified: boolean;

  /**
   * The date the user joined the platform
   * @type Date
   * @example "2021-01-01T00:00:00.000Z"
   */
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
