import { Logger, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Bid } from './entity/bid.entity';
import { Product } from '../product/entity/product.entity';
import { User } from '../user/entity/user.entity';

@EntityRepository(Bid)
export class BidRepository extends Repository<Bid> {
  private logger = new Logger('BidRepository');

  // fetch bids
  async fetchBids(): Promise<Bid[]> {
    const query = this.createQueryBuilder('bid');

    try {
      const bids = await query
        .leftJoinAndSelect(User, 'user', 'user.id = bid.UserId')
        .select(['bid.id', 'bid.bid', 'user.id', 'user.name'])
        .getRawMany();

      this.logger.verbose('fetching bids');
      return bids;
    } catch (err) {
      this.logger.error(`failed to fetch bids - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to fetch bids - ${err.message}`,
      );
    }
  }

  // bids per product
  async bidsPerProduct(id: number): Promise<Bid[]> {
    const query = this.createQueryBuilder('bid');

    try {
      const bids = await query
        .leftJoinAndSelect(Product, 'product', 'product.id = bid.ProductId')
        .leftJoinAndSelect(User, 'user', 'user.id = bid.UserId')
        .where('bid.ProductId = :id', { id: id })
        .select([
          'bid.id',
          'bid.bid',
          'product.id',
          'product.product',
          'product.initialBid',
          'user.id',
          'user.name',
        ])
        .getRawMany();

      this.logger.verbose(`fetching bids per product by id ${id}`);
      return bids;
    } catch (err) {
      this.logger.error(`failed to fetch bids per product - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to fetch bids per product - ${err.message}`,
      );
    }
  }
}
