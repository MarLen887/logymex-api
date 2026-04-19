// 1. Asegúrese de que Body y UploadedFile estén en esta línea
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto'; // Importación de su DTO

@ApiTags('Documentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('documents')
export class DocumentsController {

  @Roles(Role.JEFE_LOGISTICA, Role.DIRECTOR_GENERAL)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nombre amigable del documento' },
        file: { type: 'string', format: 'binary', description: 'El archivo PDF' },
      },
      required: ['name', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads/manifiestos');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `manifiesto-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        // 2. Aquí se añade el 'false' para cumplir con la firma estricta de la función
        cb(new BadRequestException('Formato inválido. Solo se permiten archivos PDF.'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    }
  }))
  uploadFile(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No se ha detectado ningún archivo en la petición.');
    }

    return {
      message: 'Documento subido exitosamente.',
      documentName: createDocumentDto.name,
      fileName: file.filename,
      filePath: file.path,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    };
  }
}