
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

  public sendUserMessage(body: {userEmail: string, subject: string, message: string}): Observable<any> {
    return this.http.post(`${this.url}/user-message`, body);
  }

}
