import { randomBytes } from 'crypto';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from '../../bid/entity/bid.entity';
import { argonSalt } from '../../../config/env/env.config';
import * as argon2 from 'argon2';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  password: string;

  @OneToMany(
    () => Bid,
    bid => bid._user,
  )
  _userBids: Bid[];

  @OneToMany(
    () => Product,
    product => product._userProd,
  )
  _prods: Product[];

  @BeforeInsert()
  async hashPassword() {
    const salt = randomBytes(argonSalt);
    this.password = await argon2.hash(this.password, { salt });
  }
}
