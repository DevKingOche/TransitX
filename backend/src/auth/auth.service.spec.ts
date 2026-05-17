import { Test } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";

const mockUser = {
  id: "uuid-1",
  email: "test@example.com",
  passwordHash: bcrypt.hashSync("password123", 1),
  role: "shipper",
  fullName: "Test User",
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-token"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("creates a new user and returns a token", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      });

      expect(result.accessToken).toBe("mock-token");
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
    });

    it("throws ConflictException if email already exists", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: "test@example.com", password: "pw", fullName: "X" })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("returns a token for valid credentials", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.accessToken).toBe("mock-token");
    });

    it("throws UnauthorizedException for wrong password", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login({ email: "test@example.com", password: "wrong" })
      ).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException for unknown email", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: "nobody@example.com", password: "pw" })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
