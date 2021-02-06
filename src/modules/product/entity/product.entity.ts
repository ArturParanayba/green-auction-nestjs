import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from '../../bid/entity/bid.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  product: string;

  @Column({ nullable: false })
  initialBid: number;

  @OneToMany(
    () => Bid,
    bid => bid._product,
  )
  _bids: Bid[];

  @ManyToOne(
    () => User,
    user => user._prods,
  )
  _userProd: User;
}
