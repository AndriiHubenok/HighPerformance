export interface Qualification {
  salesmanId: number;
  company: string;
  title: string;
  year: number;
  comment: string;
}

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
  qualifications: Qualification[];
}

