import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWasteDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del residuo es obligatorio' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'El tipo (RPBI o CRETIB) es obligatorio' })
    tipo: string;

    @IsString()
    @IsNotEmpty({ message: 'La clasificación es obligatoria' })
    clasificacion: string;

    @IsString()
    @IsNotEmpty({ message: 'La unidad de medida (kg, litros, etc.) es obligatoria' })
    unidadMedida: string;
}