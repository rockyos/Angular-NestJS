import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";

@Entity()
export class Photo{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guid: string;

    @Column()
    originalname: string;

    // @BeforeInsert()
    // rewrire(){
    //     Buffer.from(this.buffer.toString('hex'),'hex');
    // }
    @Column("bytea")
    buffer: Buffer;
}