import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, MaxLength, IsDateString } from 'class-validator';

// Definimos las opciones cerradas (Enums) para evitar errores ortográficos
export enum LogStatus {
    EN_RUTA = 'En ruta',
    COMPLETADO = 'Completado',
    CANCELADO = 'Cancelado',
}

export enum RpbiType {
    SANGRE = 'Sangre',
    CULTIVOS = 'Cultivos',
    PATOLOGICOS = 'Patológicos',
    NO_ANATOMICOS = 'No Anatómicos',
    PUNZOCORTANTES = 'Punzocortantes',
}

export class CreateWasteDto {
    // --- TIEMPOS ---
    @IsDateString({}, { message: 'Debe ser una fecha y hora de inicio válida (ISO 8601).' })
    @IsNotEmpty()
    startTime: string;

    @IsOptional() // Opcional porque si está "En ruta", aún no hay fecha de fin
    @IsDateString({}, { message: 'Debe ser una fecha y hora de finalización válida.' })
    endTime?: string;

    // --- ESTADOS ---
    @IsEnum(LogStatus, { message: 'El estado debe ser: En ruta, Completado o Cancelado.' })
    @IsNotEmpty()
    status: LogStatus;

    // --- DETALLES DEL RESIDUO ---
    @IsEnum(RpbiType, { message: 'Debe seleccionar una clasificación válida de RPBI.' })
    @IsNotEmpty()
    rpbiType: RpbiType;

    @IsString()
    @IsNotEmpty({ message: 'El tipo de envase es obligatorio (ej. Bolsa roja, Recipiente rígido).' })
    containerType: string;

    @IsNumber({}, { message: 'La cantidad debe ser un valor numérico.' })
    @IsNotEmpty()
    quantity: number;

    // --- OBSERVACIONES ---
    @IsString()
    @IsOptional()
    @MaxLength(1200, { message: 'Los comentarios no pueden exceder el límite aproximado de 200 palabras (1200 caracteres).' })
    comments?: string;
}