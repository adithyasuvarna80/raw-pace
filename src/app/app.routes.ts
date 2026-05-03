import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { BowlerDetail } from './components/bowler-detail/bowler-detail';
export const routes: Routes = [
    {path:'dashboard', component : Dashboard},
    {path:'bowler/:id',component:BowlerDetail},
    {path:'',redirectTo:'/dashboard',pathMatch:'full'}

];
