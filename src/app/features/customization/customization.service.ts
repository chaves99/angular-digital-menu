import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CustomizationService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + "/customization";

  public get(): Observable<Customization> {
    return this.http.get<Customization>(this.url);
  }

}

export interface Customization {
  mainColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}
