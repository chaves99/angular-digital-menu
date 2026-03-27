
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SubscriptionDetails, SubscriptionResponse } from "../payload";

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

  public getPlanUrl(): Observable<string> {
    return this.http.get(`${this.url}/new-plan`, { responseType: 'text' });
  }

  public getDetails(id: string): Observable<SubscriptionDetails> {
    return this.http.get<SubscriptionDetails>(`${this.url}/${id}/details`);
  }

  public cancel(subscriptionId: string): Observable<SubscriptionResponse> {
    return this.http.delete<SubscriptionResponse>(`${this.url}/${subscriptionId}`);
  }
}
