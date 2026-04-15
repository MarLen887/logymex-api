import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum'; // Asegurar la ruta correcta al Enum

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string; // Nombre

    @Column()
    lastName: string; // Apellidos

    @Column({ unique: true })
    username: string; // Sustituye al email para el acceso

    @Column()
    password?: string;

    // El puesto se define como un Enum, lo que fuerza a la base de datos 
    // y a la API a aceptar únicamente las opciones predefinidas.
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.OPERADOR
    })
    position: Role;

    // integridad y la trazabilidad de las bitácoras
    @Column({ default: true })
    isActive: boolean;
}