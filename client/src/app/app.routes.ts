import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { EditBookComponent } from './pages/edit-book/edit-book.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit-book/:id',
    component: EditBookComponent,
    canActivate: [authGuard]
  },
];
