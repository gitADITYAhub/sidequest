import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { ActiveQuest } from '../quest/active-quest.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    gold: number;

    @Column({ default: 'neutral' })
    currentVibe: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    age: number;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    profileVideoUrl: string;

    @Column("simple-array", { nullable: true })
    interests: string[];

    @OneToOne(() => ActiveQuest, (activeQuest) => activeQuest.user)
    activeQuest: ActiveQuest;
}
