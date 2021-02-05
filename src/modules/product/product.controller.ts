import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('api/v1/grac/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async fetchProducts(): Promise<Product[]> {
    return this.productService.fetchProducts();
  }

  @Post()
  async newProduct(@Body() productDto: ProductDto): Promise<Product> {
    return this.productService.newProduct(productDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<any> {
    return this.productService.deleteProduct(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<any> {
    return this.productService.updateProduct(id, updateProductDto);
  }
}
