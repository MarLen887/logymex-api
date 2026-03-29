import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateUnitDto {
    @ApiProperty({ description: 'Placa de circulación de la unidad', example: 'PB-1234-A' })
    @IsString()
    plateNumber: string;

    @ApiProperty({ description: 'Modelo o marca del vehículo', example: 'Kenworth T680' })
    @IsString()
    model: string;

    @ApiProperty({
        description: 'Tipo de operación de la unidad',
        enum: ['Urbana', 'Carretera'],
        example: 'Urbana'
    })
    @IsEnum(['Urbana', 'Carretera'])
    type: string;

    @ApiProperty({ description: 'Capacidad de carga en toneladas', example: 3.5 })
    @IsNumber()
    capacity: number;
}