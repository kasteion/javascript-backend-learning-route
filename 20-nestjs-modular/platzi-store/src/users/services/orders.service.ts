import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderItem } from 'src/entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';

@Injectable()
export class OrdersService {
  private counterId = 1;

  private orders: Order[] = [
    {
      id: this.counterId,
      customer: 1,
      products: [
        {
          productId: 1,
          quantity: 2,
        },
      ],
    },
  ];

  findAll() {
    return this.orders;
  }

  findOne(id: number) {
    const order = this.orders.find((e) => e.id === id);
    if (!order) throw new NotFoundException(`Brand with id ${id} not found`);
    return order;
  }

  create(payload: CreateOrderDto) {
    this.counterId += 1;
    const order = { id: this.counterId, ...payload };
    this.orders.push(order);
    return order;
  }

  update(id: number, payload: UpdateOrderDto) {
    const ordersIndex = this.orders.findIndex((e) => e.id === id);
    const order = this.findOne(id);
    if (!order) throw new NotFoundException(`Brand with id ${id} not found`);
    this.orders[ordersIndex] = { ...order, ...payload };
    return this.orders[ordersIndex];
  }

  delete(id: number) {
    this.orders = this.orders.filter((e) => e.id !== id);
    return id;
  }
}
