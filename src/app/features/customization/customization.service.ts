import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CustomizationService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + "/customization";

  public getAll(): Observable<CustomizationResponse[]> {
    return this.http.get<CustomizationResponse[]>(this.url);
  }

  public getActive(): Observable<CustomizationResponse> {
    return this.http.get<CustomizationResponse>(this.url + "/active");
  }

  public create(body: CustomizationRequest): Observable<CustomizationResponse> {
    return this.http.post<CustomizationResponse>(this.url, body);
  }

  public delete(id: number): Observable<CustomizationResponse[]> {
    return this.http.delete<CustomizationResponse[]>(`${this.url}/${id}`, {
      responseType: 'json'
    });
  }

}

export interface CustomizationRequest {
  name: string;
  mainColor: string;
  secondaryColor: string;
  theme: 'DARK' | 'LIGHT';
  font: string;
  active: boolean;
}

export interface CustomizationResponse extends CustomizationRequest {
  id: number;
  builtin: boolean;
}
