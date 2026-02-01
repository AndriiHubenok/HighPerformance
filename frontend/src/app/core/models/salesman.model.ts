export interface Salesman {
  _id?: string;
  sid: number;
  governmentId?: string;
  firstname: string;
  lastname: string;
  department: string;
  yearOfPerformance: number;
}

export interface SalesmanInput {
  sid: number;
  firstname: string;
  lastname: string;
  department?: string;
  yearOfPerformance?: number;
}
