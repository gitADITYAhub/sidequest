import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Party {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    roomCode: string;

    @Column()
    hostId: string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];
}
