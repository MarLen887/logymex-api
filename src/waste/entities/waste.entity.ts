import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('waste') // Nombre de la tabla en PostgreSQL
export class Waste {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 50 })
    tipo: string; // Guardaremos si es 'RPBI' o 'CRETIB'

    @Column({ type: 'varchar', length: 100 })
    clasificacion: string; // Ej: Punzocortantes, Sangre, Corrosivos

    @Column({ type: 'varchar', length: 20 })
    unidadMedida: string; // Ej: kg, litros, piezas

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}