import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateUserRequest, CreateUserResponse, LoginRequest } from "../payload";

@Injectable({ providedIn: 'root' })
export class UserService {

  private http = inject(HttpClient);

  private readonly url = API_URL + "/user";

  public register(body: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url, body);
  }

  public update(body: { establishmentName?: string, description?: string }): Observable<CreateUserResponse> {
    return this.http.put<CreateUserResponse>(`${this.url}`, body);
  }

  public login(body: LoginRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url + "/login", body);
  }

  public check(): Observable<CreateUserResponse> {
    return this.http.get<CreateUserResponse>(this.url);
  }

  public uploadImage(data: any): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.url}/image`, data);
  }

  public deleteImage(): Observable<CreateUserResponse> {
    return this.http.delete<CreateUserResponse>(`${this.url}/image`);
  }

  public generateRecoveryToken(email: string): Observable<any> {
    return this.http.get(`${this.url}/generate-token/${email}`);
  }

  public validateToken(email: string, token: string): Observable<any> {
    return this.http.post(`${this.url}/validate-token`, { email: email, token: token });
  }

  public resetPassword(newPassword: string, token: string, email: string): Observable<any> {
    return this.http.post(`${this.url}/reset-password`, { newPassword: newPassword, token: token, email: email });
  }

  public updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}/update-password`, {
      currentPassword: currentPassword,
      newPassword: newPassword
    });
  }

  public updateWifi(body: {name?: string, password?: string}): Observable<CreateUserResponse> {
    return this.http.put<CreateUserResponse>(`${this.url}/wifi`, body);
  }

  public deleteAccount(password: string) {
    return this.http.delete(this.url, {
      body: { password: password }
    });
  }

}
