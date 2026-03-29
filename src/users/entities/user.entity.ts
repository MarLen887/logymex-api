import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Por seguridad, la contraseña no se incluye en consultas GET
    password?: string;

    @Column()
    fullName: string;

    @Column({
        type: 'enum',
        enum: ['admin', 'operator'],
        default: 'operator'
    })
    role: string;

    @Column({ default: true })
    isActive: boolean;
}