import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './../services/orders.service';
import { CreateOrderDto, UpdateOrderDto } from './../dtos/order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.ordersService.findOne(id);
  // }

  // @Post()
  // create(@Body() payload: CreateOrderDto) {
  //   return this.ordersService.create(payload);
  // }

  // @Put(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() payload: UpdateOrderDto,
  // ) {
  //   return this.ordersService.update(id, payload);
  // }

  // @Delete(':id')
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.ordersService.delete(id);
  // }
}
