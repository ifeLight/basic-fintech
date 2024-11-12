import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class KeyValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, primary: true })
  key: string;

  @Column({ type: 'simple-json', nullable: false })
  value: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
