import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateLogDto {
    @ApiProperty({ description: 'Nombre del hospital o empresa cliente', example: 'Hospital General Puebla' })
    @IsString()
    clientName: string;

    @ApiProperty({ description: 'Dirección completa de recolección', example: 'Calle 13 Sur 2701, Puebla' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Tipo de residuo recolectado (RPBI/Químico)', example: 'Sangre y derivados (RPBI)' })
    @IsString()
    wasteType: string;

    @ApiProperty({ description: 'Peso total recolectado en kilogramos', example: 12.5 })
    @IsNumber()
    quantity: number;

    @ApiProperty({ description: 'ID de la unidad que realiza el traslado', example: 1 })
    @IsNumber()
    unitId: number;
}