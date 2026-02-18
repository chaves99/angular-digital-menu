import { Routes } from '@angular/router';
import {
  AddressComponent,
  AdminComponent,
  BannerComponent,
  CategoryComponent,
  ContactComponent,
  EstablishmentComponent,
  ProductComponent,
  ProductListComponent,
  ProductRegisterComponent,
  ScheduleComponent,
  UpdatePasswordComponent
} from './admin';
import { authGuard, loggedUserGuard } from './core';
import { LandingComponent, LoginComponent, PageComponent, RegisterComponent } from './pages';
import {
  CustomerMenuDetailComponent,
  MenuComponent,
  MenuCustomerProductsComponent
} from './pages/customer';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    canActivate: [loggedUserGuard],
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ]
  },
  {
    path: 'customer-menu/:localName',
    component: MenuComponent,
    children: [
      {
        path: '',
        component: MenuCustomerProductsComponent
      },
      {
        path: ':productId',
        component: CustomerMenuDetailComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'update-password',
        component: UpdatePasswordComponent
      },
      {
        path: 'categories',
        component: CategoryComponent
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
