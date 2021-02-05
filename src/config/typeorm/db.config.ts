import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { Product } from '../../modules/product/entity/product.entity';
import { Bid } from '../../modules/bid/entity/bid.entity';
import { User } from '../../modules/user/entity/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  tpDatabase,
  tpHost,
  tpPassword,
  tpPort,
  tpType,
  tpUsername,
} from '../env/env.config';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  private logger = new Logger('Database');

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options: any = {
      type: tpType,
      host: tpHost,
      port: tpPort,
      username: tpUsername,
      password: tpPassword,
      database: tpDatabase,
      entities: [Product, Bid, User],
      synchronize: true,
    } as TypeOrmModuleOptions;

    createConnection(options)
      .then(() => {
        this.logger.log('>_ database connected');
      })
      .catch(err => {
        this.logger.error(`database error: ${err.message}`);
        throw new InternalServerErrorException(err);
      });

    return options;
  }
}
