import { Component, inject, OnInit } from '@angular/core';
import { PriceLayerService } from '../../services';
import { PriceLayerResponse } from '../../services/payload';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-price-layer',
  imports: [
    ReactiveFormsModule,
    NgClass,
    DatePipe,
    NgStyle
  ],
  templateUrl: './price-layer.component.html'
})
export class PriceLayerComponent implements OnInit {

  private readonly priceLayerService = inject(PriceLayerService);

  priceLayers: PriceLayerResponse[] = [];

  showAlert = false;

  disableModalDisplay = 'none';
  disablePriceLayerSelected: PriceLayerResponse | null = null;

  deleteModalDisplay = 'none';
  deletePriceLayerSelected: PriceLayerResponse | null = null;

  formGroup = new FormGroup({
    name: new FormControl(),
  });

  ngOnInit(): void {
    this.priceLayerService.getAll().subscribe(p => this.priceLayers = p);
  }

  onSubmit(): void {
    const { name } = this.formGroup.value;
    if (name) {
      this.priceLayerService
        .create({ name: name, active: false })
        .subscribe(p => {
          this.priceLayers = p;
          this.formGroup.reset();
        });
    }
  }

  public delete(): void {
    if (this.deletePriceLayerSelected) {
      this.priceLayerService.delete(this.deletePriceLayerSelected.id)
        .subscribe(c => {
          this.priceLayers = c;
          this.closeDeleteModal();
        });
    }
  }

  public disable(): void {
    if (this.disablePriceLayerSelected) {
      this.priceLayerService.disable(this.disablePriceLayerSelected.id)
        .subscribe(pl => {
          this.priceLayers = pl;
          this.closeDisableModal();
        });
    }
  }

  public closeAlert(): void {
    this.showAlert = false;
  }

  public openDisableModal(priceLayer: PriceLayerResponse): void {
    const priceLayerActive = this.priceLayers.find(pl => pl.active);

    if (priceLayerActive && !(priceLayerActive.id == priceLayer.id)) {
      this.showAlert = true;
    } else {
      this.disableModalDisplay = 'block';
      this.disablePriceLayerSelected = priceLayer;
    }
  }

  public closeDisableModal(): void {
    this.disableModalDisplay = 'none';
    this.disablePriceLayerSelected = null;
  }

  public openDeleteModal(priceLayer: PriceLayerResponse): void {
    this.deleteModalDisplay = 'block';
    this.deletePriceLayerSelected = priceLayer;
  }

  public closeDeleteModal(): void {
    this.deleteModalDisplay = 'none';
    this.deletePriceLayerSelected = null;
  }
}
