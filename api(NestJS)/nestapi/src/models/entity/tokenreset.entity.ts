import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class TokenReset {
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
}