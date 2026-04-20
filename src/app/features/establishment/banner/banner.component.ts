import { Component, inject, OnInit } from '@angular/core';
import { InfoButtonComponent, SnackBarService, SpinnerComponent } from '../../../core';
import { getImagesUrl } from '../../../core/';
import { StorageService, UserService } from '../../../services';
import { CreateUserResponse } from '../../../services/payload';

@Component({
  selector: 'app-banner',
  imports: [
    SpinnerComponent,
    InfoButtonComponent
  ],
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);

  user: CreateUserResponse | null = null;

  isLoading = false;
  isDeleteLoading = false;

  currentSelectedImage: File | null = null;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  onImageChange(event: any): void {
    this.currentSelectedImage = event.target.files[0];
  }

  onSubmit(): void {
    if (this.currentSelectedImage) {
      const formData = new FormData();
      formData.append("image_file", this.currentSelectedImage, this.currentSelectedImage.name);
      this.isLoading = true;
      this.userService.uploadImage(formData).subscribe({
        next: res => {
          this.storageService.storeUser(res);
          this.user = res;
          this.snackbarService.openSuccess("Imagem atualizada com sucesso");
          this.isLoading = false;
        },
        error: res => {
          this.snackbarService.openError("erro ao adicionar imagem!");
          this.isLoading = false;
        },
      });
    } else {
      this.snackbarService.openError("Você precisa selecionar uma imagem!");
    }
  }

  onDelete(): void {
    this.isDeleteLoading = true;
    this.userService.deleteImage().subscribe({
      next: user => {
        this.user = user;
        this.isDeleteLoading = false;
        this.storageService.storeUser(user);
        this.snackbarService.openSuccess("Imagem deletada com sucesso!");
      },
      error: () => {
        this.isDeleteLoading = false;
        this.snackbarService.openError("Erro ao deletar imagem!");
      },
    });
  }

  hasImage(): boolean {
    return this.user !== null
      && this.user.image !== null
      && this.user.image !== undefined
      && this.user.image.length > 0;
  }

  getImageUrl() {
    if (this.user !== null && this.user.image !== null) {
      return getImagesUrl(this.user.image) + this.getLastModified();
    }
    return '';
  }

  getLastModified(): string {
    return "?" + new Date().getTime();
  }
}
