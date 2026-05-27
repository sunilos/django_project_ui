import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { WelcomeComponent } from './welcome/welcome';
import { RoleListComponent } from './role-list/role-list';
import { CollegeListComponent } from './college-list/college-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'roles', component: RoleListComponent },
  { path: 'colleges', component: CollegeListComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
