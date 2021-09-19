import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Injectable()
export class ProductsService {
  private counterId = 1;

  private products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Really cool product 1',
      price: 123,
      stock: 100,
      image: '',
      brand: 1,
      categories: [1, 2],
    },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((e) => e.id === id);
    if (!product)
      throw new NotFoundException(`Product with id:${id} not found`);
    return product;
  }

  create(payload: CreateProductDto) {
    this.counterId += 1;
    const newProduct = {
      id: this.counterId,
      ...payload,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, payload: UpdateProductDto) {
    let productIndex = this.products.findIndex((e) => e.id === id);
    let product = this.findOne(id);
    product = { ...product, ...payload };
    this.products[productIndex] = product;
    return product;
  }

  delete(id: number) {
    this.products = this.products.filter((e) => e.id !== id);
    return id;
  }

  findByCategory(id: number) {
    const product = this.products.filter((e) => e.categories.includes(id));
    if (!product || product.length === 0)
      throw new NotFoundException(`Product with category ${id} not found`);
    return product;
  }
}
