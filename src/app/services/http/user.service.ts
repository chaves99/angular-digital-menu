import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateUserRequest, CreateUserResponse, LoginRequest } from "../payload";

@Injectable({ providedIn: 'root' })
export class UserService {

  private http = inject(HttpClient);

  private readonly url = API_URL + "/user";

  public register(body: CreateUserRequest): Observable<CreateUserResponse> {
    console.log(API_URL);
    return this.http.post<CreateUserResponse>(this.url, body);
  }

  public login(body: LoginRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url + "/login", body);
  }

  public check(): Observable<CreateUserResponse> {
    return this.http.get<CreateUserResponse>(this.url);
  }

  public updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}/update-password`, {
      currentPassword: currentPassword,
      newPassword: newPassword
    });
  }

}
