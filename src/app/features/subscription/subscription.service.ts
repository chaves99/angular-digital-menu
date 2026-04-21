
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SubscriptionService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + "/subscription";

  public get(): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(this.url);
  }

  public updatePaymentMethod(id: string): Observable<string> {
    return this.http.get(`${this.url}/update-payment-method/${id}`, { responseType: 'text' });
  }

  public getPlanUrl(priceId: string): Observable<string> {
    return this.http.get(`${this.url}/plan/${priceId}`, { responseType: 'text' });
  }

  public getAvailablePlans(): Observable<AvailablePlans[]> {
    return this.http.get<AvailablePlans[]>(`${this.url}/plan`);
  }

  public getDetails(id: string): Observable<SubscriptionDetails> {
    return this.http.get<SubscriptionDetails>(`${this.url}/${id}/details`);
  }

  public cancel(subscriptionId: string): Observable<SubscriptionResponse> {
    return this.http.delete<SubscriptionResponse>(`${this.url}/${subscriptionId}`);
  }
}

export interface SubscriptionResponse {
  active: SubscriptionResponseItem | null;
  history: SubscriptionResponseItem[];
}

export interface SubscriptionResponseItem {
  id: string;
  description: string;
  freeTier: boolean;
  status: SubscriptionStatus;
  createdAt: Date;
  endDate: Date;
  endReason: 'UNPAID' | 'USER_CANCEL' | null;
}

export interface SubscriptionDetails {
  id: string;
  description: string;
  billingCycleAncher: Date;
  cardBrand: string;
  cardCreated: Date;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardLastDigits: string;
  startDate: Date;
}

export interface AvailablePlans {
  priceId: string;
  value: number;
  name: string;
  description: string;
  recurringInterval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  valueDiscount: number;
}

type SubscriptionStatus = 'ACTIVE' | 'PAYMENT_FAILED' | 'CANCELED';
