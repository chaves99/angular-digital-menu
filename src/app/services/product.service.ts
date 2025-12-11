import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateProductRequest, ProductResponse } from "./payload";

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly http = inject(HttpClient);

  private readonly url = environment.backend_url + '/product';

  public getAll(): Observable<any> {
    return this.http.get(this.url);
  }

  public create(body: CreateProductRequest): Observable<ProductResponse[]> {
    return this.http.post<ProductResponse[]>(this.url, body);
  }

  public getById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.url}/${id}`);
  }

  public update(id: number, body: CreateProductRequest): Observable<ProductResponse[]> {
    return this.http.patch<ProductResponse[]>(`${this.url}/${id}`, body);
  }

  public toggleActive(id: number): Observable<ProductResponse[]> {
    return this.http.put<ProductResponse[]>(`${this.url}/${id}`, null);
  }

  public delete(id: number): Observable<ProductResponse[]> {
    return this.http.delete<ProductResponse[]>(`${this.url}/${id}`);
  }

}
