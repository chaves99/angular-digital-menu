import { Routes } from '@angular/router';
import {
  AccountDataComponent,
  AddressComponent,
  AdminComponent,
  BannerComponent,
  ContactComponent,
  DashboardComponent,
  EstablishmentComponent,
  ProductComponent,
  ProductListComponent,
  ProductRegisterComponent,
  QrcodePageComponent,
  ScheduleComponent,
  UpdatePasswordComponent
} from './admin';
import { authGuard, loggedUserGuard } from './core';
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
import { CustomerMenuComponent } from './features/customer-menu/customer-menu.component';
import { CategoryComponent } from './features/category/category.component';
import { SubscriptionComponent } from '@features/subscription';

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
    component: CustomerMenuComponent,
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
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            component: ProductListComponent
          },
          {
            path: 'register',
            component: ProductRegisterComponent
          },
          {
            path: 'register/:id',
            component: ProductRegisterComponent
          }
        ]
      },
    ]
  }
];
