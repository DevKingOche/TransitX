import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from './carrier.entity';
import { CreateCarrierDto, UpdateCarrierDto } from './carrier.dto';

@Injectable()
export class CarriersService {
  constructor(
    @InjectRepository(Carrier)
    private readonly carriersRepo: Repository<Carrier>,
  ) {}

  async findAll(): Promise<Carrier[]> {
    return this.carriersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Carrier> {
    const carrier = await this.carriersRepo.findOne({ where: { id } });
    if (!carrier) throw new NotFoundException(`Carrier ${id} not found`);
    return carrier;
  }

  async create(dto: CreateCarrierDto): Promise<Carrier> {
    const existing = await this.carriersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Carrier with this email already exists');
    const carrier = this.carriersRepo.create(dto);
    return this.carriersRepo.save(carrier);
  }

  async update(id: string, dto: UpdateCarrierDto): Promise<Carrier> {
    const carrier = await this.findOne(id);
    Object.assign(carrier, dto);
    return this.carriersRepo.save(carrier);
  }

  async remove(id: string): Promise<void> {
    const carrier = await this.findOne(id);
    await this.carriersRepo.remove(carrier);
  }
}
