import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    password: string;

    @Column()
    inviteCode: string;

    @Column()
    phone: string;

    @Column()
    role: string;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    email: string;
}