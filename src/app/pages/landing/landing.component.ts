import { Location, NgOptimizedImage } from '@angular/common';
import { afterEveryRender, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlansListComponent } from '../../core';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, NgOptimizedImage, PlansListComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);

  constructor() {
    afterEveryRender({
      read: () => {
        this.activatedRoute.fragment.subscribe(f => {
          if (f) {
            this.scrollTo(f);
            const newLocation = this.location.path(false);
            this.location.replaceState(newLocation);
          }
        });
      }
    });
  }

  public scrollTo(ref: string): void {
    const element = document.getElementById(ref);
    if (element) {
      element.scroll
      element.scrollIntoView({ block: 'nearest' });
    }
  }
}
