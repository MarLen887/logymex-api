import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Log } from '../../logs/entities/log.entity'; // Asegúrate de que esta ruta sea correcta

@Entity('units')
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    plate: string; // Placa o número económico de la unidad

    @Column({
        type: 'enum',
        enum: ['Urbana', 'Carretera'],
    })
    type: string; // Diferenciación de movilidad

    @Column({
        type: 'enum',
        enum: ['Libre', 'En ruta', 'Mantenimiento'],
        default: 'Libre',
    })
    status: string; // Estatus actual para planeación logística

    @Column({ default: true })
    isActive: boolean;

    // MEJORA ARQUITECTÓNICA: Relación inversa para ver el historial de viajes de la unidad
    @OneToMany(() => Log, (log) => log.unit)
    logs: Log[];
}