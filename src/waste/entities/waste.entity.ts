import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('wastes') // Nombre de la tabla en la BD
export class Waste {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Ejemplo: Ácido clorhídrico, Sangre, etc. [cite: 34, 39]

    @Column()
    classification: string; // Ejemplo: Corrosivo, Patológico, etc. [cite: 31, 34]

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column()
    unit: string; // kg, L, etc.

    @CreateDateColumn()
    arrivalDate: Date; // Fecha de ingreso al almacén [cite: 426]

    @Column({ default: true })
    isActive: boolean;
}
