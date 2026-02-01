export interface BonusCockpit {
  salesmanId: number;
  year: number;
  grandTotal: number;
  socialBonus: {
    total: number;
    records: any[];
  };
  ordersBonus: {
    total: number;
    records: any[];
  };
  qualifications: string[];
}

