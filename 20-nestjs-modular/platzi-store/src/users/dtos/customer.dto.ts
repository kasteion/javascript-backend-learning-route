import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly user: number;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly surname: string;
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
