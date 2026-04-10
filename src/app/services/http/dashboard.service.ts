import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardResponse } from "../payload";

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + "/dashboard";

  public get(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.url);
  }
}
