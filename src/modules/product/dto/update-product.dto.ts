import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  product: string;

  @IsOptional()
  @IsNumber()
  initialBid: number;
}
