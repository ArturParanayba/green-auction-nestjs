import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Bid } from '../../bid/entity/bid.entity';

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
  _bids: number;
}
