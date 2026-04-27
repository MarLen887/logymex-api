import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    nombres!: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    usuario!: string; 

    @Column({ type: 'varchar' })
    contrasena!: string; 

    @Column({ type: 'varchar', length: 15 })
    telefono!: string;

    @Column({ type: 'enum', enum: Role, default: Role.OPERADOR })
    rol!: Role;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}