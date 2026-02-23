import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { HiringClientComponent } from './pages/hiring-client/hiring-client.component';
import { SafeworksComponent } from './pages/safeworks/safeworks.component';
import { ContractorComponent } from './pages/contractor/contractor.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'hc', component: HiringClientComponent },
      { path: 'safeworks', component: SafeworksComponent },
      { path: 'contractor', component: ContractorComponent },
      { path: '', redirectTo: 'hc', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
