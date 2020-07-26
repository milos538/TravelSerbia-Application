import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trip } from './trip.model';
import { RouterModule } from '@angular/router';
import { LogInService } from '../home-page/login.service';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})

export class TripsComponent implements OnInit,OnDestroy {
  logInSubscription : Subscription;
  trips : trip[] = [];
  recommended : trip[];
  isLoggedIn = false;
  userInfo;
  constructor(private http : HttpClient,private route : RouterModule,private logInService:LogInService,private tripData : DataService){}
  ngOnInit(): void {

    this.logInSubscription = this.logInService.user.subscribe( user => {
      if(user){
        this.isLoggedIn = true;
        this.getUserInfo();
      }
      else{
        this.isLoggedIn = false;
      }
    });
    this.tripData.getTrips().subscribe( trips => { 
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.trips = trips.filter( trip => { return trip.status == "active"});
      this.recommended = this.trips.filter( trip => {
        if( this.userInfo.pref == "Everything in nature"){
            return ( this.userInfo.amountSpent * 1.5) >= trip.price;
        }
        return trip.type ==  this.userInfo.pref;
      });
    })
    this.logInService.autoSignIn();
  }
  ngOnDestroy(){ 
    this.logInSubscription.unsubscribe();
  }
  getUserInfo = () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    this.http.get<{name:string,surname:string,adress:string,phone:string,pref:string,amountSpent:string}>(`https://travelserbia-fc974.firebaseio.com/user/${user.id}.json?auth=${user._token}`).subscribe(respData=>{
      localStorage.setItem("userInfo",JSON.stringify(respData));
      this.recommended = this.trips.filter( trip => {
        if(respData.pref == "Everything in nature"){
            return ( this.userInfo.amountSpent * 1.5) >= trip.price;
        }
        return trip.type == respData.pref;
      });
    })
  }
}