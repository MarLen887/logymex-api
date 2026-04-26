import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto) {
    const newMovement = this.inventoryRepository.create({
      tipoMovimiento: createInventoryDto.tipoMovimiento,
      cantidad: createInventoryDto.cantidad,
      residuo: { id: createInventoryDto.residuoId },
      usuario: { id: createInventoryDto.usuarioId },
    });
    return await this.inventoryRepository.save(newMovement);
  }

  async findAll() {
    return await this.inventoryRepository.find({
      relations: ['residuo', 'usuario'],
      order: { createdAt: 'DESC' }
    });
  }

  async getStock() {
    const movements = await this.findAll();
    const stock: Record<string, number> = {};

    movements.forEach(mov => {
      const residuoNombre = mov.residuo?.nombre || 'Material Desconocido';

      if (!stock[residuoNombre]) {
        stock[residuoNombre] = 0;
      }

      if (mov.tipoMovimiento === 'ENTRADA') {
        stock[residuoNombre] += Number(mov.cantidad);
      } else if (mov.tipoMovimiento === 'SALIDA') {
        stock[residuoNombre] -= Number(mov.cantidad);
      }
    });

    return stock;
  }
}