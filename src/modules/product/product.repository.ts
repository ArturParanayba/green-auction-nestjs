import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('ProductRepository');

  // fetch products
  async fetchProducts(): Promise<Product[]> {
    const query = this.createQueryBuilder();

    try {
      const prods = await query.getMany();
      this.logger.verbose('fetching products');
      return prods;
    } catch (err) {
      this.logger.error(`failed to fetch products - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to fetch products - ${err.message}`,
      );
    }
  }
}
