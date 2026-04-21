import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waste } from './entities/waste.entity';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(Waste)
    private wasteRepository: Repository<Waste>,
  ) { }

  // 1. Crear registro de residuo (Entrada a inventario)
  async create(createWasteDto: CreateWasteDto, operatorId: number): Promise<Waste> {
    const newWaste = this.wasteRepository.create({
      ...createWasteDto,
      operator: { id: operatorId }, // Inyectamos la relación dinámicamente
    });
    return await this.wasteRepository.save(newWaste);
  }

  // 2. Obtener todo el inventario activo
  async findAll(): Promise<Waste[]> {
    return await this.wasteRepository.find({ where: { isActive: true } });
  }

  // 3. Método de Búsqueda (Reutilizable y Seguro)
  async findOne(id: number): Promise<Waste> {
    const waste = await this.wasteRepository.findOne({
      where: { id, isActive: true }
    });
    if (!waste) {
      throw new NotFoundException(`La bitácora con ID ${id} no existe o fue eliminada.`);
    }
    return waste;
  }

  // 4. Método PATCH: Actualizar datos de un residuo
  async update(id: number, updateWasteDto: UpdateWasteDto): Promise<Waste> {
    const waste = await this.findOne(id); // Verificamos que exista
    // Fusionamos los datos nuevos con los existentes
    const updatedWaste = this.wasteRepository.merge(waste, updateWasteDto);
    return await this.wasteRepository.save(updatedWaste);
  }

  // 5. Método DELETE: "Eliminar" residuo (Baja lógica para auditoría)
  async remove(id: number): Promise<Waste> {
    const waste = await this.findOne(id);
    waste.isActive = false; // Desactivamos por auditoría legal, no usamos .delete()
    return await this.wasteRepository.save(waste);
  }

  async exportToExcel(res: Response): Promise<void> {
    const wastes = await this.wasteRepository.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bitácora LOGYMEX');

    // Aquí defines manualmente el arreglo 'columns'
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha de Inicio', key: 'startTime', width: 25 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Tipo RPBI', key: 'rpbiType', width: 20 },
      { header: 'Envase', key: 'containerType', width: 20 },
      { header: 'Cantidad (Kg/L)', key: 'quantity', width: 15 },
      { header: 'Observaciones', key: 'comments', width: 40 },
    ];

    // Mapeo de datos a las filas del Excel
    wastes.forEach(waste => {
      worksheet.addRow({
        id: waste.id,
        startTime: waste.startTime ? new Date(waste.startTime).toLocaleString() : 'N/A',
        status: waste.status,
        rpbiType: waste.rpbiType,
        containerType: waste.containerType,
        quantity: waste.quantity,
        comments: waste.comments,
      });
    });

    // Configuración de cabeceras y flujo de salida
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_Ambiental_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportToPdf(res: Response): Promise<void> {
    // 1. Obtener datos activos
    const wastes = await this.wasteRepository.find({ where: { isActive: true } });

    // 2. Configurar el lienzo: Tamaño Carta (LETTER), Horizontal (landscape)
    const doc = new PDFDocument({
      margin: 30,
      size: 'LETTER',
      layout: 'landscape',
    });

    // 3. Configurar cabeceras HTTP para renderizado en navegador o descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Bitacora_LOGYMEX_${Date.now()}.pdf`);

    // 4. Conectar el flujo del documento a la respuesta HTTP
    doc.pipe(res);

    // 5. Encabezado del Documento
    doc.fontSize(18).text('Bitácora de Recolección de RPBI - LOGYMEX Ambiental', { align: 'center' });
    doc.moveDown(2); // Salto de línea

    // 6. Construcción Dinámica de la Tabla (Responsiva)
    const table = {
      title: "Registros Históricos Operativos",
      headers: ["ID", "Fecha de Inicio", "Fecha de Finalización", "Operador", "Estado", "Tipo RPBI", "Envase", "Cantidad"],
      rows: wastes.map(waste => [
        waste.id.toString(),
        waste.startTime ? new Date(waste.startTime).toLocaleString() : 'N/A',
        waste.endTime ? new Date(waste.endTime).toLocaleString() : 'Pendiente',
        waste.operator ? `${waste.operator.firstName} ${waste.operator.lastName}` : 'Desconocido',
        waste.status,
        waste.rpbiType,
        waste.containerType,
        `${waste.quantity} Kg/L`
      ]),
    };

    // 7. Renderizar la tabla ajustándose automáticamente al ancho de la hoja
    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: () => doc.font('Helvetica').fontSize(9),
      width: 730, // Ancho calculado para hoja carta horizontal con márgenes de 30
    });

    // 8. Finalizar y cerrar el archivo
    doc.end();
  }
}