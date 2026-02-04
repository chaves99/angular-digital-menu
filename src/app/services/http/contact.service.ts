import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContactResponse } from "../payload";

@Injectable({ providedIn: 'root' })
export class ContactService {

  private readonly http = inject(HttpClient);

  private readonly URL = API_URL + "/contact";

  public get(): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(this.URL);
  }

  public post(body: ContactResponse): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.URL, body);
  }
}
