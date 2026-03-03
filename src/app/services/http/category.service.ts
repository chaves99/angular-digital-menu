import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoryResponse } from "../payload";

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + '/category';

  public create(body: { name: string }[]): Observable<CategoryResponse[]> {
    return this.http.post<CategoryResponse[]>(this.url, body);
  }

  public getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.url);
  }

  public disable(id: number): Observable<CategoryResponse[]> {
    return this.http.put<CategoryResponse[]>(`${this.url}/disable/${id}`, null);
  }

  public update(id: number, body: { name: string }): Observable<CategoryResponse[]> {
    return this.http.put<CategoryResponse[]>(`${this.url}/${id}`, body);
  }

  public updateSequece(body: { id: number, sequence: number }[]): Observable<CategoryResponse[]> {
    return this.http.put<CategoryResponse[]>(`${this.url}/sequence`, body);
  }

  public delete(id: number): Observable<CategoryResponse[]> {
    return this.http.delete<CategoryResponse[]>(`${this.url}/${id}`);
  }

}
