import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waste } from './entities/waste.entity';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

// Se utiliza require ya que pdfkit-table no tiene tipado oficial en TypeScript
const PDFDocument = require('pdfkit-table');

@Injectable()
export class WasteService {
  constructor(
    @InjectRepository(Waste)
    private readonly wasteRepository: Repository<Waste>,
  ) { }

  // 1. Crear registro de residuo (Entrada a inventario) vinculando al operador
  async create(createWasteDto: CreateWasteDto, operatorId: number): Promise<Waste> {
    const newWaste = this.wasteRepository.create({
      ...createWasteDto,
      // Forzamos el tipado a 'any' temporalmente para que TypeORM acepte la inserción solo por ID
      operator: { id: operatorId } as any,
    });
    return await this.wasteRepository.save(newWaste);
  }

  // 2. Obtener todo el inventario activo
  async findAll(): Promise<Waste[]> {
    return await this.wasteRepository.find({
      where: { isActive: true },
      // eager: true en la entidad ya trae al operador, pero lo declaramos explícito por seguridad
      relations: ['operator']
    });
  }

  // 3. Método de Búsqueda (Reutilizable y Seguro)
  async findOne(id: number): Promise<Waste> {
    const waste = await this.wasteRepository.findOne({
      where: { id, isActive: true },
      relations: ['operator']
    });

    if (!waste) {
      throw new NotFoundException(`La bitácora con ID ${id} no existe o fue eliminada.`);
    }
    return waste;
  }

  // 4. Método PATCH: Actualizar datos de un residuo
  async update(id: number, updateWasteDto: UpdateWasteDto): Promise<Waste> {
    const waste = await this.findOne(id); // Verificamos que exista primero
    // Fusionamos los datos nuevos con los existentes
    const updatedWaste = this.wasteRepository.merge(waste, updateWasteDto);
    return await this.wasteRepository.save(updatedWaste);
  }

  // 5. Método DELETE: Borrado lógico para auditoría legal (NOM-087)
  async remove(id: number): Promise<Waste> {
    const waste = await this.findOne(id);
    waste.isActive = false; // Desactivamos en lugar de eliminar la fila
    return await this.wasteRepository.save(waste);
  }

  // 6. Exportación a Excel (Corregido para solo exportar activos y mostrar Operador)
  async exportToExcel(res: Response): Promise<void> {
    const wastes = await this.wasteRepository.find({
      where: { isActive: true },
      relations: ['operator']
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bitácora LOGYMEX');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha de Inicio', key: 'startTime', width: 25 },
      { header: 'Operador', key: 'operator', width: 30 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Tipo RPBI', key: 'rpbiType', width: 20 },
      { header: 'Envase', key: 'containerType', width: 20 },
      { header: 'Cantidad (Kg/L)', key: 'quantity', width: 15 },
      { header: 'Observaciones', key: 'comments', width: 40 },
    ];

    wastes.forEach(waste => {
      worksheet.addRow({
        id: waste.id,
        startTime: waste.startTime ? new Date(waste.startTime).toLocaleString() : 'N/A',
        operator: waste.operator ? `${waste.operator.firstName} ${waste.operator.lastName}` : 'Desconocido',
        status: waste.status,
        rpbiType: waste.rpbiType,
        containerType: waste.containerType,
        quantity: waste.quantity,
        comments: waste.comments,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_Ambiental_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  // 7. Exportación a PDF (Ajustado)
  async exportToPdf(res: Response): Promise<void> {
    const wastes = await this.wasteRepository.find({
      where: { isActive: true },
      relations: ['operator']
    });

    const doc = new PDFDocument({
      margin: 30,
      size: 'LETTER',
      layout: 'landscape',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Bitacora_LOGYMEX_${Date.now()}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('Bitácora de Recolección de RPBI - LOGYMEX Ambiental', { align: 'center' });
    doc.moveDown(2);

    const table = {
      title: "Registros Históricos Operativos",
      headers: ["ID", "Inicio", "Fin", "Operador", "Estado", "Tipo RPBI", "Envase", "Cantidad"],
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

    await doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: () => doc.font('Helvetica').fontSize(9),
      width: 730,
    });

    doc.end();
  }
}