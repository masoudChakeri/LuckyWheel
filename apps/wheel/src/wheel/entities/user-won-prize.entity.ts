import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Prize } from './prize.entity';
@Entity()
export class UserWonPrize {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    prize_id: string;

    @ManyToOne(() => Prize, (prize) => prize.id, {eager: true})
    @JoinColumn({ name: 'prize_id' })
    prize: Prize;
}
