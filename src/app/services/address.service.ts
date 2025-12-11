import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AddressResponse } from "./payload";

@Injectable({ providedIn: 'root' })
export class AddressService {

  private readonly http = inject(HttpClient);

  private readonly url = environment.backend_url + "/address";

  public getAll(): Observable<AddressResponse[]> {
    return this.http.get<AddressResponse[]>(this.url);
  }

  public create(body: AddressResponse[]) {
    return this.http.post(this.url, body);
  }
}
