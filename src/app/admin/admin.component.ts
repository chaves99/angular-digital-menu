import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CreateUserResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  private storageService = inject(StorageService);
  private router = inject(Router);

  public user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  public logout(): void {
    this.storageService.cleanUser();
    this.router.navigate(["/"])
  }

}
