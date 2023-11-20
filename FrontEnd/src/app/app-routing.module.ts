import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { AboutComponent } from './pages/about/about.component';
import { StartComponent } from './pages/start/start.component';

const routes: Routes = [
  {path: '',
   component: StartComponent,
   pathMatch:'full'
  },
  {
    path:'start',
    component: StartComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'admin',
    component: AdminComponent
  },
  {
    path:'ticketList',
    component: TicketListComponent
  },
  {
    path:'about',
    component: AboutComponent
  },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
