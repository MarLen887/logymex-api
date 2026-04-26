import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';

@Entity('users') // Nombre de la tabla en PostgreSQL
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    nombres: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    usuario: string; // Único para que no haya dos empleados con el mismo usuario

    @Column({ type: 'varchar' })
    contrasena: string; // Aquí guardaremos la contraseña, pero la encriptaremos

    @Column({ type: 'varchar', length: 15 })
    telefono: string;

    @Column({ type: 'enum', enum: Role, default: Role.OPERADOR })
    rol: Role;

    @Column({ type: 'boolean', default: true })
    isActive: boolean; // Control para dar de alta/baja al personal

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}