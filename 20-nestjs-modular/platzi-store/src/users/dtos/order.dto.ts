import { IsNotEmpty, IsNumber, IsPositive, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { OrderItem } from './../entities/order.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly customer: number;
  @IsArray()
  readonly products: OrderItem[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
