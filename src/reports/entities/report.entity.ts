import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    titulo: string;

    @Column({ type: 'varchar', length: 50 })
    tipo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'generadoPorId' })
    generadoPor: User;

    @CreateDateColumn()
    createdAt: Date;
}