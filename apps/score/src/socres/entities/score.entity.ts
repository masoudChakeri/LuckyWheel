import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Score{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    total_score: number;
}