import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Photo{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guid: string;

    @Column()
    originalname: string;

    @Column("bytea")
    buffer: Buffer;

    @ManyToOne(type => User, user => user.photos)
    user: User;

    constructor(guid: string, originalname: string,  buffer: Buffer) {
        this.guid = guid;
        this.originalname = originalname;
        this.buffer = buffer;
    }
}