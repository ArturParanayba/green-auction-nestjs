import { IsNotEmpty, IsNumber } from 'class-validator';

export class BidDto {
  @IsNotEmpty()
  @IsNumber()
  bid: number;
}
