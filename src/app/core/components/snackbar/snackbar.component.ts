import { NgClass } from '@angular/common';
import { Component, output, Type } from '@angular/core';

@Component({
  selector: 'toast',
  imports: [NgClass],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div [ngClass]="getTypeClass()" class="toast border show" >
        <div class="toast-header">
          @switch (data.type) {
            @case('SUCCESS') {
              <strong class="me-auto text-success"><i class="bi bi-check2-all"></i></strong>
            }
            @case('ERROR') {
              <strong class="me-auto text-danger"><i class="bi bi-exclamation-triangle"></i></strong>
            }
            @case('DEFAULT') {
              <strong class="me-auto"><i class="bi bi-info-lg"></i></strong>
            }
          }
          <button type="button" class="btn-close" (click)="onInternalClose()"></button>
        </div>
        <div class="toast-body">
          {{ data !== null ? data.message : ''  }}
        </div>
      </div>
    </div>
  `
})
export class SnackBarComponent {

  onClose = output();

  data: {
    type: SnackBarType;
    message: string;
  } = {
      message: '',
      type: 'DEFAULT'
    };

  private readonly typeClassMap = new Map<SnackBarType, string>();

  constructor() {
    this.typeClassMap.set('SUCCESS', 'border-success');
    this.typeClassMap.set('ERROR', 'border-danger');
    this.typeClassMap.set('DEFAULT', '');
  }

  public getTypeClass(): string {
    return this.typeClassMap.get(this.data.type) ?? '';

  }

  public onInternalClose(): void {
    this.onClose.emit();
  }

}

export type SnackBarType = 'SUCCESS' | 'ERROR' | 'DEFAULT';
