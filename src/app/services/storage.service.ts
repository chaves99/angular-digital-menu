import { inject, Injectable } from "@angular/core";
import { CreateUserResponse } from "../services/payload/";
import { CookieService } from "ngx-cookie-service";

@Injectable({providedIn: "root"})
export class StorageService {

  private cookieService = inject(CookieService);

  public store(key: string, data: string) {
    this.cookieService.set(key, data, 0, "/");
  }

  public get(key: string): string | null {
    return this.cookieService.get(key);
  }

  public delete(key: string): void {
    this.cookieService.delete(key, "/");
  }

  public storeUser(user: CreateUserResponse): void {
    this.cleanUser();
    const userJson = JSON.stringify(user);
    this.cookieService.set("user", userJson, 0, "/");
  }

  public getUser(): CreateUserResponse | null {
    const userJson = this.cookieService.get("user");
    if (userJson.length === 0) return null;

    const user: CreateUserResponse = JSON.parse(userJson);
    return user;
  }

  public cleanUser() {
    this.cookieService.delete("user");
    this.cookieService.delete("user", "/");
  }
}
