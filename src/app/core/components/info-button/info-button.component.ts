import { Component, input, OnInit } from "@angular/core";

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html'
})
export class InfoButtonComponent implements OnInit {

  paragraphs = input<string[]>([]);
  title = input<string | null>(null);

  ngOnInit(): void {
  }
}
