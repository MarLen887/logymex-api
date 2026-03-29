import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateWasteDto {
    @ApiProperty({ description: 'Nombre del residuo', example: 'Sangre RPBI' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Clasificación del residuo', example: 'CRETI' })
    @IsString()
    classification: string;

    @ApiProperty({ description: 'Cantidad en kilogramos', example: 15.5 })
    @IsNumber()
    quantity: number;

    @ApiProperty({ description: 'Unidad de la cantidad de residuo', example: 'Kg' })
    @IsString()
    unit: string;
}