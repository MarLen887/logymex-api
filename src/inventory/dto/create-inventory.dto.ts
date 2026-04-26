import { IsString, IsNotEmpty, IsNumber, IsIn, IsUUID, IsOptional } from 'class-validator';

export class CreateInventoryDto {
    @IsUUID()
    @IsNotEmpty({ message: 'Debe especificar el ID del residuo' })
    residuoId: string;

    @IsString()
    @IsIn(['ENTRADA', 'SALIDA'], { message: 'El tipo de movimiento debe ser ENTRADA o SALIDA' })
    tipoMovimiento: string;

    @IsNumber()
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    cantidad: number;

    @IsString()
    @IsOptional()
    usuarioId?: string; // Se inyectará internamente mediante el Token JWT
}