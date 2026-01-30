import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  imports: [],
  templateUrl: './snackbar.component.html'
})
export class SnackbarComponent implements OnInit {

  hasAction = false;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, dismiss: () => {}, action?: () => {} }) { }

  ngOnInit(): void {
    if (this.data.action)
      this.hasAction = true;

  }

  onClose() {
    this.data.dismiss();
  }

  onAction() {
    if (this.data.action)
      this.data.action();
  }

}
