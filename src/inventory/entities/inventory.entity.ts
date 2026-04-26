import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Waste } from '../../waste/entities/waste.entity';
import { User } from '../../users/entities/user.entity';

@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 20 })
    tipoMovimiento: string; // Permitirá 'ENTRADA' o 'SALIDA'

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cantidad: number;

    // Relación con el material específico
    @ManyToOne(() => Waste)
    @JoinColumn({ name: 'residuoId' })
    residuo: Waste;

    // Auditoría: Quién registró el movimiento
    @ManyToOne(() => User)
    @JoinColumn({ name: 'usuarioId' })
    usuario: User;

    @CreateDateColumn()
    createdAt: Date;
}