import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto';

@Injectable()
export class CategoriesService {
  private counterId = 1;

  private categories: Category[] = [
    {
      id: this.counterId,
      name: 'Category 1',
      description: 'A description for category 1',
    },
  ];

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    let category = this.categories.find((e) => e.id === id);
    if (!category) throw new NotFoundException(`Brand with id ${id} not found`);
    return category;
  }

  create(payload: CreateCategoryDto) {
    this.counterId += 1;
    const category = { id: this.counterId, ...payload };
    this.categories.push(category);
    return category;
  }

  update(id: number, payload: UpdateCategoryDto) {
    const categoryIndex = this.categories.findIndex((e) => e.id === id);
    const category = this.findOne(id);
    if (!category) throw new NotFoundException(`Brand with id ${id} not found`);
    this.categories[categoryIndex] = { ...category, ...payload };
    return this.categories[categoryIndex];
  }

  delete(id: number) {
    this.categories = this.categories.filter((e) => e.id !== id);
    return id;
  }
}
