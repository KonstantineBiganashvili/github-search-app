import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const password = 'hashedPassword123';
      const mockUser = {
        id: '123',
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(email, password);

      expect(mockRepository.create).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: '123',
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const id = '123';
      const mockUser = {
        id,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return user with password field', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: '123',
        email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmailWithPassword(email);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: ['id', 'email', 'password', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(mockUser);
    });
  });
});
