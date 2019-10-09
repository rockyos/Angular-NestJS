import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.token = crypto.createHmac('sha256', this.token).digest('hex');
  }
  @Column()
  token: string;

  @Column()
  createDate: Date;

  @ManyToOne(type => User, user => user.tokens)
  user: User;
}