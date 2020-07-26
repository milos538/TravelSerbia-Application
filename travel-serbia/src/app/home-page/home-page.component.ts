import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LogInService } from "src/app/home-page/login.service";
import { Subscription } from 'rxjs';
import { trip } from '../trips/trip.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit, OnDestroy {
  @ViewChild('trips') trips;
  isLoggedIn = false;
  isLoading = false;
  isFinished = false;
  subscription : Subscription;
  message : {message: string, type: string};
  searchTrips : trip[] = [];
  constructor(public loginService : LogInService) { }

  ngOnInit(): void {
    this.subscription = this.loginService.user.subscribe( user => {
      if(user){
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
      }
      }
    );
    this.loginService.autoSignIn();
  }
  
  ngOnDestroy(){ 
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm){
    this.isLoading = true;
    const email = form.form.value.email;
    const password = form.form.value.password;
    this.loginService.signIn(email,password)
    .subscribe( 
    responseData => {
      this.isLoading = false;
      this.isFinished = true;
      this.message = {message: null,type:"success"};
    },
    errorMessage =>{
      this.isLoading = false;
      this.isFinished = true;
      this.message = {message: errorMessage,type: "error"};
      }
    );
  }

  search = (event) =>{
    const list = document.querySelector(".search__list");
    const value = event.target.value.toUpperCase();
    if(value.length >= 1){
      this.searchTrips = this.trips.trips.filter( trip =>{
        return trip.name.toUpperCase().includes(value);
      })
    }
  };

  lostFocus = () =>{
    setTimeout( () =>{
      this.searchTrips = [];
    },300)
  }
  
}