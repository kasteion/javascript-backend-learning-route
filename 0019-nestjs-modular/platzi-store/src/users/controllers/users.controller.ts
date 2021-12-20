import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './../services/users.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './../dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':username/orders')
  getOrders(@Param('username') username: string) {
    return this.usersService.getOrdersByUser(username);
  }

  @Get()
  getKey() {
    return this.usersService.getKey();
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Post('login')
  login(@Body() payload: LoginUserDto) {
    const { username, password } = payload;
    return this.usersService.login(username, password);
  }

  @Put(':username')
  update(@Param('username') username: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(username, payload);
  }

  @Delete(':username')
  delete(@Param('username') username: string) {
    return this.usersService.delete(username);
  }
}
