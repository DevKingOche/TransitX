import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CarrierStatus } from './carrier.entity';

export class CreateCarrierDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  stellarAddress?: string;

  @IsOptional()
  @IsString()
  dotNumber?: string;

  @IsOptional()
  @IsString()
  mcNumber?: string;

  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;

  @IsOptional()
  insuranceExpiryDate?: Date;
}

export class UpdateCarrierDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  stellarAddress?: string;

  @IsOptional()
  @IsEnum(CarrierStatus)
  status?: CarrierStatus;

  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;

  @IsOptional()
  insuranceExpiryDate?: Date;
}
