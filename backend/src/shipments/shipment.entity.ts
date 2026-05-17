import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

export type ShipmentStatus =
  | "draft"
  | "pending_pickup"
  | "in_transit"
  | "delivered"
  | "disputed"
  | "cancelled";

@Entity("shipments")
export class Shipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ nullable: true })
  cargoDescription: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  weightKg: number;

  @Column({ type: "decimal", precision: 18, scale: 7 })
  paymentAmount: string;

  @Column({ default: "USDC" })
  paymentCurrency: string;

  @Column({
    type: "enum",
    enum: ["draft", "pending_pickup", "in_transit", "delivered", "disputed", "cancelled"],
    default: "draft",
  })
  status: ShipmentStatus;

  @Column({ nullable: true })
  escrowAddress: string;

  @Column({ nullable: true })
  escrowContractId: string;

  @Column({ nullable: true })
  pickupDate: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "shipper_id" })
  shipper: User;

  @Column({ name: "shipper_id" })
  shipperId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "carrier_id" })
  carrier: User;

  @Column({ name: "carrier_id", nullable: true })
  carrierId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
