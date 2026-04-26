import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty({ message: 'El titulo del reporte es obligatorio' })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de reporte es obligatorio' })
    tipo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    generadoPorId?: string;
}