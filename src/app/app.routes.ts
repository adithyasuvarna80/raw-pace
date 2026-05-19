import { Routes } from '@angular/router'; 
import { Dashboard } from './components/dashboard/dashboard'; 
import { BowlerDetail } from './components/bowler-detail/bowler-detail'; 
import { Login } from './components/login/login'; 
import { Register } from './components/register/register'; 

export const routes: Routes = [ 
  {path: 'login', component: Login}, 
  {path: 'register', component: Register},
  {path: 'dashboard', component: Dashboard}, 
  {path: 'bowler/:id', component: BowlerDetail}, 
  {path: '', redirectTo: '/login', pathMatch: 'full'} 
];