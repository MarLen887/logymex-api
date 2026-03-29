import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('units')
export class Unit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    plate: string; // Placa o número económico de la unidad [cite: 325]

    @Column({
        type: 'enum',
        enum: ['Urbana', 'Carretera'],
    })
    type: string; // Diferenciación de movilidad [cite: 56, 420]

    @Column({
        type: 'enum',
        enum: ['Libre', 'En ruta', 'Mantenimiento'],
        default: 'Libre',
    })
    status: string; // Estatus actual para planeación logística [cite: 325, 327]

    @Column({ default: true })
    isActive: boolean;
}