import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('products/:id')
  // getProducts(@Param() params: any): string {
  //   return `Product ${params.id}`;
  // }
  getProduct(@Param('id') id: string): string {
    return `Products ${id}`;
  }

  @Get('categories/:id/products/:productId')
  getCategory(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ): string {
    return `Category: ${id}, Product: ${productId}`;
  }

  @Get('products')
  getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ): string {
    return `limit => ${limit}, offset => ${offset}, brand => ${brand}`;
  }
}
