import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { AboutComponent } from './pages/about/about.component';
import { StartComponent } from './pages/start/start.component';
import { JwtInterceptor } from './jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    TicketListComponent,
    AboutComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MdbCollapseModule,
    MdbDropdownModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          // Implementa la logica per recuperare il token dal localStorage o da un'altra fonte
          return localStorage.getItem('token');
        },
      },
    }),
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:JwtInterceptor,
    multi:  true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
