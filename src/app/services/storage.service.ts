import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CreateUserResponse } from "../services/payload/";

@Injectable({ providedIn: "root" })
export class StorageService {

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public store(key: string, data: string) {
    if (this.isBrowser) {
      localStorage.setItem(key, data);
    }
  }

  public get(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public delete(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  public storeUser(user: CreateUserResponse): void {
    this.cleanUser();
    const userJson = JSON.stringify(user);
    this.store("user", userJson);
  }

  public getUser(): CreateUserResponse | null {
    const userJson = this.get("user");
    if (userJson === null || userJson.length === 0) return null;

    const user: CreateUserResponse = JSON.parse(userJson);
    return user;
  }

  public cleanUser() {
    this.delete("user");
  }

}
