import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { Shipment } from "./shipment.entity";

const mockShipment: Partial<Shipment> = {
  id: "uuid-1",
  trackingNumber: "FF-001",
  origin: "Lagos",
  destination: "Nairobi",
  status: "draft",
  shipperId: "user-1",
};

const mockRepo = {
  create: jest.fn().mockReturnValue(mockShipment),
  save: jest.fn().mockResolvedValue(mockShipment),
  find: jest.fn().mockResolvedValue([mockShipment]),
  findOne: jest.fn().mockResolvedValue(mockShipment),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
};

describe("ShipmentsService", () => {
  let service: ShipmentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        { provide: getRepositoryToken(Shipment), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(ShipmentsService);
    jest.clearAllMocks();
  });

  it("creates a shipment", async () => {
    mockRepo.create.mockReturnValue(mockShipment);
    mockRepo.save.mockResolvedValue(mockShipment);

    const result = await service.create(
      { origin: "Lagos", destination: "Nairobi", paymentAmount: 1500 },
      "user-1"
    );

    expect(result).toEqual(mockShipment);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it("finds all shipments", async () => {
    mockRepo.find.mockResolvedValue([mockShipment]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it("finds one shipment by id", async () => {
    mockRepo.findOne.mockResolvedValue(mockShipment);
    const result = await service.findOne("uuid-1");
    expect(result).toEqual(mockShipment);
  });

  it("throws NotFoundException for unknown shipment", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne("bad-id")).rejects.toThrow(NotFoundException);
  });
});
