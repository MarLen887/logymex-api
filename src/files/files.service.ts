import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {

  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    // Retornamos la ruta donde se guardó la imagen para que la App móvil 
    // pueda adjuntarla a la creación de la bitácora.
    return {
      mensaje: 'Archivo subido correctamente',
      fileName: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}