import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './../dtos/brand.dto';

@Injectable()
export class BrandsService {
  private counterId = 1;

  private brands: Brand[] = [
    {
      id: this.counterId,
      name: 'Nike',
      image: 'https://google.com',
    },
  ];

  findAll() {
    return this.brands;
  }

  findOne(id: number) {
    const brand = this.brands.find((e) => e.id === id);
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    return brand;
  }

  create(payload: CreateBrandDto) {
    this.counterId += 1;
    const brand = { id: this.counterId, ...payload };
    this.brands.push(brand);
    return brand;
  }

  update(id: number, payload: UpdateBrandDto) {
    const brandIndex = this.brands.findIndex((e) => e.id === id);
    const brand = this.findOne(id);
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    this.brands[brandIndex] = { ...brand, ...payload };
    return this.brands[brandIndex];
  }

  delete(id: number) {
    this.brands = this.brands.filter((e) => e.id !== id);
    return id;
  }
}
