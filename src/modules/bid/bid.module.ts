import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidRepository } from './bid.repository';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';

@Module({
  imports: [TypeOrmModule.forFeature([BidRepository])],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
