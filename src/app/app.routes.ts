import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page.component';

/*
const routes: Routes = [
  { path: 'credentials', component: CredentialsComponent },
  { path: 'selector', component: CenterProvinceSelectorComponent },
  { path: 'home',   component: MainPageComponent, canActivate: [IsLoggedGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
*/

export const routes: Routes = [
  { path: 'home',   component: MainPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
