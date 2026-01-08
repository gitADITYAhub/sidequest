import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class QuestTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    difficulty: string; // Easy, Medium, Hard

    @Column()
    type: string; // Solo, Party

    @Column({ default: 100 })
    xp: number; // XP reward for completing the quest

    @Column('simple-array')
    tags: string[]; // e.g., ["outdoors", "social"]
}
