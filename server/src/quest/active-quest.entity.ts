import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class ActiveQuest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    status: string; // In Progress, Completed

    @Column()
    startTime: Date;

    @Column({ nullable: true })
    expirationTime: Date;

    @Column('simple-array')
    tags: string[];

    @Column({ nullable: true })
    proofVideoUrl: string;

    @OneToOne(() => User, (user) => user.activeQuest)
    @JoinColumn()
    user: User;
}
