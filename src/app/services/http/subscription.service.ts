
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AvailablePlans, SubscriptionDetails, SubscriptionResponse } from "../payload";

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
