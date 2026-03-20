
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SubscriptionResponse } from "../payload";

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

  public cancel(subscriptionId: string): Observable<SubscriptionResponse> {
    return this.http.delete<SubscriptionResponse>(`${this.url}/${subscriptionId}`);
  }
}
