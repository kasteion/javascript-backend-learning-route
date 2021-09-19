import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from 'src/entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from 'src/dto/customer.dto';

@Injectable()
export class CustomersService {
  private counterId = 1;

  private customers: Customer[] = [
    {
      id: this.counterId,
      user: 1,
      name: 'Custo',
      surname: 'Mer',
      address: 'Customer address',
    },
  ];

  findAll() {
    return this.customers;
  }

  findOne(id: number) {
    const customer = this.customers.find((e) => e.id === id);
    if (!customer) throw new NotFoundException(`Brand with id ${id} not found`);
    return customer;
  }

  create(payload: CreateCustomerDto) {
    this.counterId += 1;
    const customer = { id: this.counterId, ...payload };
    this.customers.push(customer);
    return customer;
  }

  update(id: number, payload: UpdateCustomerDto) {
    const customerIndex = this.customers.findIndex((e) => e.id === id);
    const customer = this.findOne(id);
    if (!customer) throw new NotFoundException(`Brand with id ${id} not found`);
    this.customers[customerIndex] = { ...customer, ...payload };
    return this.customers[customerIndex];
  }

  delete(id: number) {
    this.customers = this.customers.filter((e) => e.id !== id);
    return id;
  }
}
