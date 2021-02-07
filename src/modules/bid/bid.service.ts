import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { Bid } from './entity/bid.entity';
import { ProductRepository } from '../product/product.repository';
import { Connection } from 'typeorm';
import { BidDto } from './dto/bid.dto';
import { User } from '../user/entity/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class BidService {
  private logger = new Logger('BidService');
  private productRepository: ProductRepository;

  constructor(
    private connection: Connection,
    private bidRepository: BidRepository,
  ) {
    this.productRepository = this.connection.getCustomRepository(
      ProductRepository,
    );
  }

  // fetch bids
  async fetchBids(): Promise<Bid[]> {
    return this.bidRepository.fetchBids();
  }

  // new bid
  async newBid(id: number, bidDto: BidDto, user: User): Promise<any> {
    const { bid } = bidDto;
    const newBid = new Bid();

    // product that will receive the bid
    const prod = await this.productRepository.findOne(id);
    if (!prod) {
      this.logger.error('product doest not exist');
      throw new InternalServerErrorException('product does not exist');
    }

    // check user age
    if (user.age < 18) {
      this.logger.error(
        `Sorry, you cannot make a bid if you are not over 18. Your age: ${user.age}`,
      );
      throw new InternalServerErrorException(
        `Sorry, you cannot make a bid if you are not over 18. Your age: ${user.age}`,
      );
    }

    // check bids
    const bidsPerProduct = await this.bidRepository.find({
      where: [{ _product: prod }],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const checkBids = bidsPerProduct.map(bidCheck => {
      if (bid <= bidCheck.bid || bid <= prod.initialBid) {
        this.logger.error(
          'A higher bid has already been made for this product',
        );
        throw new ConflictException(
          'A higher bid has already been made for this product',
        );
      }
    });

    // new bid instance
    newBid.bid = bid;
    newBid._product = prod;
    newBid._user = user;

    try {
      await this.bidRepository.save(newBid);

      this.logger.verbose('new bid registered!');

      delete newBid._user.password;

      return {
        bidId: newBid.id,
        bid: newBid.bid,
        user: user.name,
        product: prod.product,
      };
    } catch (err) {
      this.logger.error(`failed to register new bid - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to register new bid - ${err.message}`,
      );
    }
  }

  // get bids per product
  async bidsPerProduct(id: number): Promise<Bid[]> {
    const prod = await this.productRepository.findOne(id);
    if (!prod) {
      this.logger.error(`productId ${id} invalid or product does not exist`);
      throw new InternalServerErrorException(
        `productId ${id} invalid or product does not exist`,
      );
    }

    try {
      const bids = await this.bidRepository.find({
        _product: prod,
      });
      this.logger.verbose(`fetching bids for product "${prod.product}"`);
      return bids;
    } catch (err) {
      this.logger.error(`failed to fetch bids - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to fetch bids - ${err.message}`,
      );
    }
  }

  // delete bid
  async deleteBid(id: number): Promise<any> {
    const bid = await this.bidRepository.findOne(id);

    try {
      await this.bidRepository.remove(bid);
      this.logger.verbose(`bid deleted! bid: ${bid.bid}`);
      return {
        bidDeleted: bid,
      };
    } catch (err) {
      this.logger.error(`failed to delete bid - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to delete bid - ${err.message}`,
      );
    }
  }

  // bids per product
  async bidsPerProductRight(id: number): Promise<Bid[]> {
    return this.bidRepository.bidsPerProduct(id);
  }
}
