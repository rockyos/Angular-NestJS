import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

    constructor(guid: string, originalname: string,  buffer: Buffer) {
        this.guid = guid;
        this.originalname = originalname;
        this.buffer = buffer;
    }
}