import { Component, inject } from '@angular/core';
import { CustomerMenuComponent } from '@features/customer-menu/customer-menu.component';
import { CustomizationService } from './customization.service';

@Component({
  selector: 'app-customization',
  imports: [CustomerMenuComponent],
  templateUrl: './customization.component.html',
})
export class CustomizationComponent {

  private readonly customizationService = inject(CustomizationService);

}
