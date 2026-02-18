import { Component, inject, OnInit } from '@angular/core';
import { StorageService, UserService } from '../../../services';
import { CreateUserResponse } from '../../../services/payload';
import { SnackBarService, SpinnerComponent } from '../../../core';

@Component({
  selector: 'app-banner',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);

  user: CreateUserResponse | null = null;

  isLoading = false;

  currentSelectedImage: File | null = null;

  ngOnInit(): void {
    console.log(caches);
    this.user = this.storageService.getUser();
    console.log(this.user);
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

  hasImage(): boolean {
    return this.user !== null
      && this.user.image !== null
      && this.user.image !== undefined
      && this.user.image.length > 0;
  }

  getLastModified(): string {
    return "?" +  new Date().getTime();
  }
}
