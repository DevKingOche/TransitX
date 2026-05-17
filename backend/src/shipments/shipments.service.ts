import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Shipment } from './shipment.entity';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly repo: Repository<Shipment>,
  ) {}

  findAll(): Promise<Shipment[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.repo.findOne({ where: { id } });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  async create(dto: CreateShipmentDto, shipperId: string): Promise<Shipment> {
    const trackingNumber = `FF-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    const shipment = this.repo.create({
      ...dto,
      paymentAmount: String(dto.paymentAmount),
      trackingNumber,
      shipperId,
      status: 'draft',
    });
    return this.repo.save(shipment);
  }

  async update(id: string, dto: UpdateShipmentDto): Promise<Shipment> {
    await this.repo.update(id, dto as Partial<Shipment>);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
