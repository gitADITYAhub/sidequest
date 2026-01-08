import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@Index(['userId', 'tileId'], { unique: true }) // Prevent duplicate unlocks
export class ExploredTile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column({ type: 'varchar', length: 32 })
    tileId: string; // The S2 Cell Token (e.g., "1/313113002211003")

    @CreateDateColumn()
    unlockedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}
