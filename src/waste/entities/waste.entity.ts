import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Verifique que la ruta de importación sea la correcta

@Entity('wastes')
export class Waste {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column()
    status: string;

    @Column()
    rpbiType: string;

    @Column()
    containerType: string;

    @Column('float')
    quantity: number;

    @Column({ type: 'varchar', length: 1200, nullable: true })
    comments: string;

    @Column({ default: true })
    isActive: boolean;

    // Implementación de la llave foránea
    @ManyToOne(() => User, (user) => user.wastes, { eager: true })
    @JoinColumn({ name: 'operator_id' })
    operator: User;
}