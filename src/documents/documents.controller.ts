import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Documentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('documents')
export class DocumentsController {

  // Solo el Director y el Jefe de Logística pueden subir documentos legales
  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    // 1. Configuración de almacenamiento local
    storage: diskStorage({
      destination: (req, file, cb) => {
        // Al usar un callback, evitamos que Multer intente ejecutar 'mkdir'
        cb(null, './uploads/manifiestos');
      },
      filename: (req, file, cb) => {
        // Generamos un nombre único para evitar que un archivo sobrescriba a otro
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `manifiesto-${uniqueSuffix}${ext}`);
      }
    }),
    // 2. Filtro estricto: Solo aceptamos PDFs
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Formato de archivo inválido. Por seguridad, solo se permiten documentos PDF.'), false);
      }
    },
    // 3. Límite de carga: 5 MB máximo para no saturar el servidor
    limits: {
      fileSize: 5 * 1024 * 1024,
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha detectado ningún archivo en la petición.');
    }

    // Retornamos la información estructural. Más adelante, esta ruta (file.path)
    // es la que guardaremos en la base de datos de PostgreSQL.
    return {
      message: 'Documento subido y validado exitosamente.',
      fileName: file.filename,
      filePath: file.path,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };
  }
}