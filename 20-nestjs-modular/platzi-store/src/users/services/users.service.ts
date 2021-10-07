import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { ProductsService } from './../../products/services/products.service';
import { Order } from '../entities/order.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private counterId = 1;

  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
  ) {}

  private users: User[] = [
    {
      id: this.counterId,
      username: 'user01',
      email: 'user@example.com',
      password: '$2b$10$xpchNpjPuZADVBiW/2sajOTjL5l.JGLOn7wX1c4vr/UepY7W8gy7m',
    },
  ];

  getKey(): string {
    return `This is the API_KEY ${this.configService.get(
      'API_KEY',
    )}, and this is the DATABASE_NAME ${this.configService.get(
      'DATABASE_NAME',
    )}`;
  }

  findOne(username: string): User {
    const user = this.users.find((e) => e.username === username);
    if (!user) throw new UnauthorizedException(`Invalid username or password`);
    delete user.password;
    return user;
  }

  async create(payload: CreateUserDto) {
    this.counterId += 1;
    const user = { id: this.counterId, ...payload };
    user.password = await bcrypt.hash(user.password, 10);
    this.users.push(user);
    delete user.password;
    return user;
  }

  update(username: string, payload: UpdateUserDto) {
    const userIndex = this.users.findIndex((e) => e.username === username);
    const user = this.findOne(username);
    if (!user) throw new NotFoundException(`Username ${username} not found`);
    this.users[userIndex] = { ...user, ...payload };
    return this.users[userIndex];
  }

  delete(username: string) {
    this.users = this.users.filter((e) => e.username !== username);
    return username;
  }

  async login(username, password) {
    const user = this.findOne(username);
    if (!user) throw new UnauthorizedException('Invalid username or password');
    //let result = false;
    const result = await bcrypt.compare(password, user.password);
    return result;
  }

  getOrdersByUser(username: string): Order {
    const user = this.findOne(username);
    return {
      date: new Date(),
      user,
      products: this.productsService.findAll(),
    };
  }
}
