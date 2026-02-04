import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MenuResponse } from "../payload";

@Injectable({ providedIn: 'root' })
export class MenuService {

  private readonly http = inject(HttpClient);

  private readonly URL = API_URL + '/menu';

  public get(establishmentName: string): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(`${this.URL}/${establishmentName}`);
  }

  public getDetail(establishmentName: string, productId: string): Observable<any> {
    return this.http.get(`${this.URL}/${establishmentName}/${productId}`);
  }
}
