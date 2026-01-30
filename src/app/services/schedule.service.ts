import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ScheduleRequest, ScheduleResponse } from "./payload";

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  private readonly http = inject(HttpClient);

  private readonly URL = environment.backend_url + '/schedule';

  public getAll(): Observable<ScheduleResponse[]> {
    return this.http.get<ScheduleResponse[]>(this.URL);
  }

  public post(body: ScheduleRequest[]): Observable<any> {
    return this.http.post(this.URL, body);
  }
}
