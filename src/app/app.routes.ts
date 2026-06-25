import { Routes } from '@angular/router';
import { AccountDataComponent } from '@features/account-data/account-data.component';
import { AdminComponent } from '@features/admin';
import { CustomizationComponent } from '@features/customization/customization.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { AddressComponent, BannerComponent, ContactComponent, EstablishmentComponent, ScheduleComponent } from '@features/establishment';
import { ProductComponent } from '@features/product';
import { QrcodePageComponent } from '@features/qrcode/qrcode-page.component';
import { SubscriptionComponent } from '@features/subscription/subscription.component';
import { UpdatePasswordComponent } from '@features/update-password/update-password.component';
import { authGuard, loggedUserGuard } from './core';
import { CategoryComponent } from './features/category/category.component';
import {
    LandingComponent,
    LoginComponent,
    PageComponent,
    PasswordRecoveryComponent,
    PostSaleComponent,
    PrivacyComponent,
    RegisterComponent,
    SendMessageComponent,
    TermsOfServiceComponent
} from './pages';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'send-message',
        component: SendMessageComponent
      },
      {
        path: 'post-sale',
        component: PostSaleComponent
      },
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'terms',
        component: TermsOfServiceComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loggedUserGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [loggedUserGuard]
      },
      {
        path: 'password-recovery',
        component: PasswordRecoveryComponent,
        canActivate: [loggedUserGuard]
      }
    ]
  },
  {
    path: 'customer-menu/:localName',
    loadComponent: () => import("@features/customer-menu/customer-menu.component").then(c => c.CustomerMenuComponent)
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'account-data',
        component: AccountDataComponent
      },
      {
        path: 'send-message',
        component: SendMessageComponent
      },
      {
        path: 'subscription',
        component: SubscriptionComponent
      },
      {
        path: 'update-password',
        component: UpdatePasswordComponent
      },
      {
        path: 'categories',
        component: CategoryComponent
      },
      {
        path: 'qr-code',
        component: QrcodePageComponent
      },
      {
        path: 'customize',
        component: CustomizationComponent
      },
      {
        path: 'establishment',
        component: EstablishmentComponent,
        children: [
          {
            path: '',
            redirectTo: 'address',
            pathMatch: 'full'
          },
          {
            path: 'address',
            component: AddressComponent
          },
          {
            path: 'schedule',
            component: ScheduleComponent
          },
          {
            path: 'contact',
            component: ContactComponent
          },
          {
            path: 'banner',
            component: BannerComponent
          }
        ]
      },
      {
        path: 'products',
        component: ProductComponent,
      },
    ]
  }
];
