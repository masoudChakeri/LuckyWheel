import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_id: string;

    @Column()
    user_id: string;

    @Column()
    quantity: number;

    @Column()
    total_price: number;
}
