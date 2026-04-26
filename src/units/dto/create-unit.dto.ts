import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateUnitDto {
    @IsString()
    @IsNotEmpty({ message: 'Las placas son obligatorias' })
    placas: string;

    @IsString()
    @IsNotEmpty({ message: 'La marca es obligatoria' })
    marca: string;

    @IsString()
    @IsNotEmpty({ message: 'El modelo es obligatorio' })
    modelo: string;

    @IsString()
    @IsOptional()
    @IsIn(['Libre', 'En Ruta', 'Mantenimiento'], { message: 'El estatus debe ser Libre, En Ruta o Mantenimiento' })
    estatus?: string;
}