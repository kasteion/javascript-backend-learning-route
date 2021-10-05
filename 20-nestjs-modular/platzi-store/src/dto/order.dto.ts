import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { OrderItem } from 'src/entities/order.entity';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly customer: number;
  @IsArray()
  readonly products: OrderItem[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
