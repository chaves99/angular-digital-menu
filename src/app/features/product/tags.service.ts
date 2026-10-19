import { HttpClient, httpResource, HttpResourceRef } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TagsService {

  private readonly http = inject(HttpClient);

  public getAll(): Observable<TagsResponse[]> {
    return this.http.get<TagsResponse[]>(`${API_URL}/tags`);
  }

  public tagsResource(): HttpResourceRef<TagsResponse[] | undefined> {
    return httpResource<TagsResponse[]>(() => ({
      url: `${API_URL}/tags`,
      method: 'GET'
    }));
  }

  public create(name: string): Observable<TagsResponse> {
    return this.http.post<TagsResponse>(`${API_URL}/tags`, name);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/tags/${id}`);
  }
}

export interface TagsResponse {
  id: number;
  name: string;
}
