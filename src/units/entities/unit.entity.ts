import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('units') // Nombre de la tabla en PostgreSQL
export class Unit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    placas: string;

    @Column({ type: 'varchar', length: 50 })
    marca: string;

    @Column({ type: 'varchar', length: 50 })
    modelo: string;

    @Column({ type: 'varchar', length: 20, default: 'Libre' })
    estatus: string; // Puede ser: 'Libre', 'En Ruta', 'Mantenimiento'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}