
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EmailService {

  private readonly http = inject(HttpClient);

  private readonly url = API_URL + "/email";

  public sendQRcode(qrcode: any): Observable<any> {
    return this.http.post(`${this.url}/qrcode`, qrcode);
  }
}
