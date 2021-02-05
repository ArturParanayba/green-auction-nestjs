import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductDto } from './dto/product.dto';
import { Product } from './entity/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductService');

  constructor(private productRepository: ProductRepository) {}

  // register new product
  async newProduct(productDto: ProductDto): Promise<Product> {
    const { product, initialBid } = productDto;
    const newProd = new Product();

    newProd.product = product;
    newProd.initialBid = initialBid;

    try {
      await this.productRepository.save(newProd);
      this.logger.verbose(
        `new product "${product}" registered! initial bid: ${initialBid}`,
      );
      return newProd;
    } catch (err) {
      this.logger.error(`failed to register product - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to register product - ${err.message}`,
      );
    }
  }

  // delete product
  async deleteProduct(id: number): Promise<any> {
    const prod = await this.productRepository.findOne(id);

    try {
      await this.productRepository.remove(prod);
      this.logger.verbose(`product "${prod.product}" deleted!`);
      return {
        productDeleted: prod,
      };
    } catch (err) {
      this.logger.error(`failed to delete product or product does not exist`);
      throw new InternalServerErrorException(
        `failed to delete product or product does not exist`,
      );
    }
  }

  // update product
  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<any> {
    try {
      await this.productRepository.update(id, updateProductDto);
      this.logger.verbose('product updated!');
      return {
        productId: id,
        updatedFields: updateProductDto,
      };
    } catch (err) {
      this.logger.error(
        `failed to update product by id ${id} or product does not exist`,
      );
      throw new InternalServerErrorException(
        `failed to update product by id ${id} or product does not exist`,
      );
    }
  }

  // fetch products
  async fetchProducts(): Promise<Product[]> {
    return this.productRepository.fetchProducts();
  }
}
