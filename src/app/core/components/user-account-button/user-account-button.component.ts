import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../services';
import { CreateUserResponse } from '../../../services/payload';

@Component({
  selector: 'app-user-account-button',
  imports: [RouterLink],
  templateUrl: './user-account-button.component.html'
})
export class UserAccountButtonComponent {

  user = input<CreateUserResponse | null>(null);

  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  public logout(): void {
    this.storageService.cleanUser();
    this.router.navigate(["/login"])
  }
}
