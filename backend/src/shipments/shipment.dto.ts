import { IsString, IsNumber, IsPositive, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';

export type ShipmentStatus =
  | 'draft'
  | 'pending_pickup'
  | 'in_transit'
  | 'delivered'
  | 'disputed'
  | 'cancelled';

export class CreateShipmentDto {
  @IsString()
  @MinLength(3)
  origin: string;

  @IsString()
  @MinLength(3)
  destination: string;

  @IsOptional()
  @IsString()
  cargoDescription?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @IsNumber()
  @IsPositive()
  paymentAmount: number;

  @IsOptional()
  @IsDateString()
  pickupDate?: string;
}

export class UpdateShipmentDto {
  @IsOptional()
  @IsEnum(['draft', 'pending_pickup', 'in_transit', 'delivered', 'disputed', 'cancelled'])
  status?: ShipmentStatus;

  @IsOptional()
  @IsString()
  carrierId?: string;

  @IsOptional()
  @IsString()
  escrowAddress?: string;

  @IsOptional()
  @IsString()
  escrowContractId?: string;
}
