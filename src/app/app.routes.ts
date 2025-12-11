import { Routes } from '@angular/router';
import {
    AddressComponent,
    AdminComponent,
    CategoryComponent,
    EstablishmentComponent,
    PriceLayerComponent,
    ProductComponent,
    ProductListComponent,
    ProductRegisterComponent
} from './admin';
import { authGuard, loggedUserGuard } from './core';
import { LoginComponent, PageComponent, RegisterComponent } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    canActivate: [loggedUserGuard],
    children: [
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
    loadComponent: () => import('./pages/customer-menu/customer-menu.component')
      .then(c => c.CustomerMenuComponent)
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'establishment',
        component: EstablishmentComponent
      },
      {
        path: 'categories',
        component: CategoryComponent
      },
      {
        path: 'config/address',
        component: AddressComponent
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
      {
        path: 'price-layer',
        component: PriceLayerComponent
      }
    ]
  }
];
