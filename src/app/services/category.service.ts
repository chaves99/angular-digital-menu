
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoryResponse } from "./payload";

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + '/category';

  public create(body: {name: string}[]): Observable<CategoryResponse[]> {
    return this.http.post<CategoryResponse[]>(this.url, body);
  }

  public getAll(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.url);
  }

  public disable(id: number): Observable<CategoryResponse[]> {
    return this.http.put<CategoryResponse[]>(`${this.url}/disable/${id}`, null);
  }

  public delete(id: number): Observable<CategoryResponse[]> {
    return this.http.delete<CategoryResponse[]>(`${this.url}/${id}`);
  }

}
