import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
