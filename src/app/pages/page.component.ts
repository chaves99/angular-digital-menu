import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-initial-page',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './page.component.html',
})
export class PageComponent {

}
