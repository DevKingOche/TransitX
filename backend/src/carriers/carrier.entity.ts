import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum CarrierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  stellarAddress: string;

  @Column({ nullable: true })
  dotNumber: string;

  @Column({ nullable: true })
  mcNumber: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  completedShipments: number;

  @Column({ type: 'enum', enum: CarrierStatus, default: CarrierStatus.ACTIVE })
  status: CarrierStatus;

  @Column({ nullable: true })
  insurancePolicyNumber: string;

  @Column({ nullable: true, type: 'date' })
  insuranceExpiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
