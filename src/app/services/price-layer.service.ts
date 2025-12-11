import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { PriceLayerRequest, PriceLayerResponse } from "./payload";

@Injectable({ providedIn: 'root' })
export class PriceLayerService {

  private readonly http = inject(HttpClient);

  private readonly url = environment.backend_url + '/layer';

  public getAll(): Observable<PriceLayerResponse[]> {
    return this.http.get<PriceLayerResponse[]>(this.url);
  }

  public create(body: PriceLayerRequest): Observable<PriceLayerResponse[]> {
    return this.http.post<PriceLayerResponse[]>(this.url, body);
  }

  public disable(id: number): Observable<PriceLayerResponse[]> {
    return this.http.put<PriceLayerResponse[]>(`${this.url}/${id}`, null);
  }

  public delete(id: number): Observable<PriceLayerResponse[]> {
    return this.http.delete<PriceLayerResponse[]>(`${this.url}/${id}`);
  }
}
