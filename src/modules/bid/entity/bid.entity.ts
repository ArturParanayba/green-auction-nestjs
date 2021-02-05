import { User } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bid: number;

  @ManyToOne(
    () => Product,
    product => product._bids,
  )
  _product: Product;

  @ManyToOne(
    () => User,
    user => user._userBids,
  )
  _user: User;
}
