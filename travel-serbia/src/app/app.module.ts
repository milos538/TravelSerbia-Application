import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { TripsComponent } from './trips/trips.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TravelHistoryComponent } from './user-profile/travel-history/travel-history.component';
import { TripComponent } from './trips/trip/trip.component';
import { AlertComponent } from './alert/alert.component';
import { TimesPipe } from './times.pipe';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterComponent,
    TripsComponent,
    LoadingSpinnerComponent,
    UserProfileComponent,
    TravelHistoryComponent,
    TripComponent,
    AlertComponent,
    TimesPipe,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
