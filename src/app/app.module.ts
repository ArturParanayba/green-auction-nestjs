import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmService } from '../config/typeorm/db.config';
import { ProductModule } from '../modules/product/product.module';
import { BidModule } from '../modules/bid/bid.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    ProductModule,
    BidModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
