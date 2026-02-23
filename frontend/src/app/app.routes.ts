import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HiringClientComponent } from './pages/hiring-client/hiring-client.component';
import { IsnComponent } from './pages/isn/isn.component';
import { ContractorComponent } from './pages/contractor/contractor.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'hc', component: HiringClientComponent },
      { path: 'isn', component: IsnComponent },
      { path: 'contractor', component: ContractorComponent },
      { path: '', redirectTo: 'hc', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
