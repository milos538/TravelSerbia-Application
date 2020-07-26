import { NgModule } from '@angular/core';
import { Routes,RouterModule, Router } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TravelHistoryComponent } from './user-profile/travel-history/travel-history.component';
import { TripComponent } from './trips/trip/trip.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes : Routes = [
    {path:'', component: HomePageComponent},
    {path:'register', component: RegisterComponent},
    {path:'profile', component: UserProfileComponent},
    {path:'history', component: TravelHistoryComponent},
    {path:'trip',component: TripComponent},
    {path:'admin',component: AdminComponent},
    {path: '**', component: HomePageComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{

}