import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string; // cafe, park, library, gym, etc.

    @Column({ type: 'decimal', precision: 10, scale: 8 })
    lat: number;

    @Column({ type: 'decimal', precision: 11, scale: 8 })
    lng: number;

    @Column({ default: false })
    isPremium: boolean; // Golden pin for partners

    @Column({ nullable: true })
    partnerId: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}
