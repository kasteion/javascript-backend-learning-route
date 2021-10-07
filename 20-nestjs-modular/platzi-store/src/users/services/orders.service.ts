import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from './../dtos/order.dto';

@Injectable()
export class OrdersService {
  private counterId = 1;

  private orders: Order[] = [
    {
      date: new Date(),
      user: {
        id: 1,
        username: 'user01',
        email: 'user01@email.com',
        password: '12345678',
      },
      products: [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 1,
          stock: 100,
          image: 'https://www.google.com',
          brand: 1,
          categories: [1],
        },
      ],
    },
  ];

  findAll() {
    return this.orders;
  }

  // findOne(id: number) {
  //   const order = this.orders.find((e) => e.id === id);
  //   if (!order) throw new NotFoundException(`Brand with id ${id} not found`);
  //   return order;
  // }

  // create(payload: CreateOrderDto) {
  //   this.counterId += 1;
  //   const order = { id: this.counterId, ...payload };
  //   this.orders.push(order);
  //   return order;
  // }

  // update(id: number, payload: UpdateOrderDto) {
  //   const ordersIndex = this.orders.findIndex((e) => e.id === id);
  //   const order = this.findOne(id);
  //   if (!order) throw new NotFoundException(`Brand with id ${id} not found`);
  //   this.orders[ordersIndex] = { ...order, ...payload };
  //   return this.orders[ordersIndex];
  // }

  // delete(id: number) {
  //   this.orders = this.orders.filter((e) => e.id !== id);
  //   return id;
  // }
}
