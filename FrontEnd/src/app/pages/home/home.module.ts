import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';



@NgModule({
  declarations: [
    HomeComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MdbFormsModule
  ]
})
export class HomeModule { }
