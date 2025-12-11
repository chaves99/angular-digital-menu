import { inject, Injectable } from "@angular/core";
import { CreateUserResponse } from "../services/payload/";
import { CookieService } from "ngx-cookie-service";

@Injectable({providedIn: "root"})
export class StorageService {

  private cookieService = inject(CookieService);

  public storeUser(user: CreateUserResponse): void {
    const userJson = JSON.stringify(user);
    this.cookieService.set("user", userJson);
  }

  public getUser(): CreateUserResponse | null {
    const userJson = this.cookieService.get("user");
    if (userJson.length === 0) return null;

    const user: CreateUserResponse = JSON.parse(userJson);
    return user;
  }

  public cleanUser() {
    this.cookieService.delete("user");
  }
}
