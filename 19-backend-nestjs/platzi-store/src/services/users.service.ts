import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private counterId = 1;

  private users: User[] = [
    {
      id: this.counterId,
      username: 'user01',
      email: 'user@example.com',
      password: '$2b$10$xpchNpjPuZADVBiW/2sajOTjL5l.JGLOn7wX1c4vr/UepY7W8gy7m',
    },
  ];

  findOne(username: string): User {
    const user = this.users.find((e) => e.username === username);
    if (!user) throw new UnauthorizedException(`Invalid username or password`);
    delete user.password;
    return user;
  }

  async create(payload: CreateUserDto) {
    this.counterId += 1;
    let user = { id: this.counterId, ...payload };
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
}
