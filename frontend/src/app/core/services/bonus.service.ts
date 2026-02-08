import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BonusCockpit, OrderPerformance, SocialPerformanceInput } from '../models';

export interface DashboardStats {
  stats: {
    totalSalesmen: number;
    activeThisYear: number;
    departmentsCount: number;
    avgPerformance: number;
    totalSocialBonus: number;
    totalOrderBonus: number;
    grandTotalBonus: number;
  };
  performanceByPerson: {
    name: string;
    socialBonus: number;
    orderBonus: number;
    totalBonus: number;
    year?: number;
  }[];
  bonusDistribution: {
    name: string;
    value: number;
  }[];
  recentSalesmen: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BonusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/bonus';

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  syncEmployeesFromOrangeHRM(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/integration/orangehrm/sync-employees`, {});
  }

  addSocialPerformanceWithBonus(performance: SocialPerformanceInput & { remarks?: string }): Observable<any> {
    return this.http.post('/api/social-performance', performance);
  }

  approveSocialBonusesHR(sid: number, year: number): Observable<{ status: string; finalBonus: number; bonusStatus: any }> {
    return this.http.post<{ status: string; finalBonus: number; bonusStatus: any }>(`${this.baseUrl}/approve/final/hr/${sid}/${year}`, {});
  }

  approveSocialBonusesCEO(sid: number, year: number, qualification?: string): Observable<{ status: string; finalBonus: number; bonusStatus: any }> {
    return this.http.post<{ status: string; finalBonus: number; bonusStatus: any }>(
      `${this.baseUrl}/approve/final/ceo/${sid}/${year}`,
      { qualification }
    );
  }

  approveSocialBonusesSalesman(sid: number, year: number, approval: boolean): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/approve/final/salesman/${sid}/${year}/${approval}`,
      {}
    );
  }

  fetchOrderPerformance(sid: number, year: number): Observable<{ message: string; data: OrderPerformance[] }> {
    return this.http.post<{ message: string; data: OrderPerformance[] }>(
      `${this.baseUrl}/orders/fetch/${sid}/${year}`,
      {}
    );
  }

  getCockpit(sid: number, year: number): Observable<BonusCockpit> {
    return this.http.get<BonusCockpit>(`${this.baseUrl}/cockpit/${sid}/${year}`);
  }

  finalApprovalHR(sid: number, year: number): Observable<{ status: string; finalBonus: number; bonusStatus: any }> {
    return this.http.post<{ status: string; finalBonus: number; bonusStatus: any }>(
      `${this.baseUrl}/approve/final/hr/${sid}/${year}`,
      {}
    );
  }

  finalApprovalCEO(sid: number, year: number, qualification?: string): Observable<{ status: string; finalBonus: number; bonusStatus: any }> {
    return this.http.post<{ status: string; finalBonus: number; bonusStatus: any }>(
      `${this.baseUrl}/approve/final/ceo/${sid}/${year}`,
      { qualification }
    );
  }

  finalApprovalSalesman(sid: number, year: number, approval: boolean): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/approve/final/salesman/${sid}/${year}/${approval}`,
      {}
    );
  }
}

