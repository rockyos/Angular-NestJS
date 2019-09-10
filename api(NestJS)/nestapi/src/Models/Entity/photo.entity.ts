import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { Guid } from "guid-typescript";

@Entity()
export class Photo{
    @PrimaryGeneratedColumn()
    id: number;

    // @BeforeInsert()
    // beforeInsert(){
    //     this.guid = Guid.create().toString();
    // }
    @Column()
    guid: string;

    @Column()
    originalname: string;

    @Column("bytea")
    buffer: Buffer;
}