import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BidService } from './bid.service';
import { Bid } from './entity/bid.entity';
import { BidDto } from './dto/bid.dto';
import { GetUser } from 'src/common';
import { User } from '../user/entity/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/grac/bids')
export class BidController {
  constructor(private bidService: BidService) {}

  @Get()
  async fetchBids(): Promise<Bid[]> {
    return this.bidService.fetchBids();
  }

  @Get(':id')
  async bidsPerProduct(@Param('id') id: number): Promise<Bid[]> {
    return this.bidService.bidsPerProduct(id);
  }

  @Post(':id')
  async newBid(
    @Param('id') id: number,
    @Body() bidDto: BidDto,
    @GetUser() user: User,
  ): Promise<Bid> {
    return this.bidService.newBid(id, bidDto, user);
  }

  @Delete(':id')
  async deleteBid(@Param('id') id: number): Promise<any> {
    return this.bidService.deleteBid(id);
  }

  @Get('product/:id')
  async bidsPerProductRight(@Param('id') id: number): Promise<Bid[]> {
    return this.bidService.bidsPerProductRight(id);
  }
}
