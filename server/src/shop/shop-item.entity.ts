import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShopItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    cost: number;

    @Column()
    icon: string; // e.g., "coffee", "shirt", "ticket"
}
