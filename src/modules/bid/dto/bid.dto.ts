export interface ProductBids {
  userId: number;
  productId: number;
  bid: number;
}

export class BidDto {
  bids: ProductBids[];
}
