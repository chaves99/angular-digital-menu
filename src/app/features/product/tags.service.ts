import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TagsService {

  private readonly http = inject(HttpClient);

  public getAll(): Observable<Tags[]> {
    return this.http.get<Tags[]>(`${API_URL}/tags`);
  }

  public create(name: string): Observable<any> {
    return this.http.post(`${API_URL}`, name);
  }
}

export interface Tags {
  id: number;
  name: number;
}
