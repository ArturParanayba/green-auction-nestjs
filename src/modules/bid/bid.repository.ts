import { EntityRepository, Repository } from 'typeorm';
import { Bid } from './entity/bid.entity';

@EntityRepository(Bid)
export class BidRepository extends Repository<Bid> {}
