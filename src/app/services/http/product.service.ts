import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProductRequest, Pagination, ProductResponse } from "../payload";

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + '/product';

  public getAll(requestParam?: {
    page: number,
    size: number,
    name?: string | null,
    active?: boolean | null,
    categoryId?: number | null
  }): Observable<Pagination<ProductResponse>> {
    let params = undefined;
    if (requestParam) {
      const { name, active, categoryId } = requestParam;
      params = {
        page: requestParam.page,
        size: requestParam.size,
      };

      if (name && name !== null)
        params = { ...params, name: name };
      if (active !== undefined && active !== null)
        params = { ...params, active: active };
      if (categoryId && categoryId !== null)
        params = { ...params, categoryId: categoryId };
    }
    return this.http.get<Pagination<ProductResponse>>(this.url, { params: params });
  }

  public uploadImage(productId: number, image: any): Observable<any> {
    return this.http.post(`${this.url}/${productId}/image`, image);
  }

  public deleteImage(productId: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.url}/${productId}/image`);
  }

  public create(body: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.url, body);
  }

  public getById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.url}/${id}`);
  }

  public update(id: number, body: CreateProductRequest): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.url}/${id}`, body);
  }

  public toggleActive(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}`, null);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

}
