export interface OrderPerformance {
  _id?: string;
  salesmanId: number;
  year: number;
  orderId: string;
  productName?: string;
  clientName?: string;
  clientRanking?: string;
  closingProbability?: number;
  quantity: number;
  amount: number;
  currency: string;
  computedBonus: number;
  hrReviewStatus: boolean;
  ceoReviewStatus: boolean;
}

