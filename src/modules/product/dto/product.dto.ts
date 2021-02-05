import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  product: string;

  @IsNotEmpty()
  @IsNumber()
  initialBid: number;
}
