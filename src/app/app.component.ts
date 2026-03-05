import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{


  titleService = inject(Title);

  title = 'ItiMenu - Menu Digital com QR Code';

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}
