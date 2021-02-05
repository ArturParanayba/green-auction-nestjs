import { Logger, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Bid } from './entity/bid.entity';

@EntityRepository(Bid)
export class BidRepository extends Repository<Bid> {
  private logger = new Logger('BidRepository');

  // fetch bids
  async fetchBids(): Promise<Bid[]> {
    const query = this.createQueryBuilder();

    try {
      const bids = await query.getMany();
      this.logger.verbose('fetching bids');
      return bids;
    } catch (err) {
      this.logger.error(`failed to fetch bids - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to fetch bids - ${err.message}`,
      );
    }
  }
}
