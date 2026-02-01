export interface SocialPerformance {
  _id?: string;
  salesmanId: number;
  description: string;
  valueSupervisor: number;
  valuePeerGroup: number;
  bonusValue: number;
  year: number;
  remarks?: string;
  isApprovedByCEO: boolean;
}

export interface SocialPerformanceInput {
  salesmanId: number;
  description: string;
  valueSupervisor: number;
  valuePeerGroup: number;
  year: number;
  remarks?: string;
}

