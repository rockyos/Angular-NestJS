import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as crypto from 'crypto';
import { Photo } from './photo.entity';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
  @Column()
  password: string;

  @Column()
  createDate: Date;

  @OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(type=> Token, token => token.user)
  tokens: Token[];
}