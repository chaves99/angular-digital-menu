import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../services';
import { CreateUserResponse } from '../../services/payload';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-data',
  imports: [DatePipe],
  templateUrl: './account-data.component.html'
})
export class AccountDataComponent implements OnInit {

  private readonly storageService = inject(StorageService);

  user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

}
