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
import { ProductsService } from './../services/products.service';
import { CreateProductDto, UpdateProductDto } from './../dtos/product.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List of products.' })
  getProducts() {
    return this.productService.findAll();
  }

  // getProducts(@Param() params: any): string {
  //   return `Product ${params.id}`;
  // }
  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Get('/category/:id')
  getByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findByCategory(id);
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
