import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserRequest, CreateUserResponse, LoginRequest } from "./payload";

@Injectable({providedIn: 'root'})
export class UserService {

  private http = inject(HttpClient);

  private readonly url = environment.backend_url + "/user";

  public register(body: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url, body);
  }

  public login(body: LoginRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.url + "/login", body);
  }
}
