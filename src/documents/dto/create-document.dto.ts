import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
    @ApiProperty({ description: 'Nombre descriptivo del documento para mostrar en la app' })
    @IsString()
    @IsNotEmpty({ message: 'Debe proporcionar un nombre para identificar el documento en la aplicación.' })
    name: string;
}