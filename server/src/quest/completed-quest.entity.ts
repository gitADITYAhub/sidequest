import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { QuestTemplate } from '../quest/quest-template.entity';

export type QuestStatus = 'pending' | 'verified' | 'rejected';

@Entity()
export class CompletedQuest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    questId: number;

    @Column({ type: 'varchar', length: 20, default: 'pending' })
    status: QuestStatus;

    @Column({ type: 'text', nullable: true })
    proofVideoUrl: string;

    @Column({ type: 'int', default: 0 })
    xpAwarded: number;

    @Column({ type: 'int', default: 0 })
    goldAwarded: number;

    @Column({ type: 'text', nullable: true })
    verificationNotes: string; // AI feedback

    @CreateDateColumn()
    completedAt: Date;

    @UpdateDateColumn()
    verifiedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToOne(() => QuestTemplate, (quest) => quest.id)
    quest: QuestTemplate;
}
