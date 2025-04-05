import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { UserWonPrize } from './user-won-prize.entity';
@Entity()
export class Prize {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({ type: 'decimal' })
    weight: number;

    @Column()
    score: number;

    @Column()
    justOnce: boolean;

    @OneToMany(() => UserWonPrize, userWonPrize => userWonPrize.prize)
    userWonPrizes: UserWonPrize[];
}
