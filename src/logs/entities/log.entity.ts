import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Unit } from '../../units/entities/unit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientName: string;

    @Column()
    address: string;

    @Column()
    wasteType: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => Unit, { eager: true })
    @JoinColumn({ name: 'unit_id' })
    unit: Unit;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'operator_id' })
    operator: User;

    @Column({ default: true })
    isActive: boolean;
}