import { Component, OnInit, OnDestroy } from '@angular/core';
import { trip } from '../trip.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/user.model';
import { HttpClient } from '@angular/common/http';
import { LogInService } from '../../home-page/login.service';
import { Subscription } from 'rxjs';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit,OnDestroy{
  trip : trip;
  isLoggedIn = false;
  isEnrolled = false;
  open = true;
  subscription : Subscription;
  message = "You already enrolled!";
  constructor(private route: ActivatedRoute,private http: HttpClient,private logInService : LogInService,private dataService : DataService) {}
  
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user"));
    this.subscription = this.logInService.user.subscribe( user => {
      if(user){
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
      }
      }
    );
    this.logInService.autoSignIn();
    this.route.queryParams.subscribe( params =>{
      let temp = undefined;
      if(params['students']){
        temp = Object.values(JSON.parse(params['students']));
      }
      this.trip = new trip(params['name'],params['text'],params['type'],params['status'],params['price'],
      params['location'],params['image'],params['from'],params['to'],params['id'],temp);
      this.trip.students.forEach( student => {
        if(student.id == user.id){
          this.isEnrolled = true;
          return;
        }
      })
    });
  }
  ngOnDestroy(){ 
    this.subscription.unsubscribe();
  }
  onClick = () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userData = {name: userInfo.name,surname: userInfo.surname, id: user.id};
    this.http.post(`https://travelserbia-fc974.firebaseio.com/trip/${this.trip.id}/students.json?auth=${user._token}`, userData)
    .subscribe(
      data =>{ 
        this.message ="You enrolled successfully and university will be notified about your desire to go. Thank you! ";
        this.open = true;
        this.isEnrolled = true;
        this.dataService.addStudent(this.trip.id,userData);
      },
      error =>{ 
        this.message ="There was an unknown error. Please try again later!";
        this.open = true;
        this.isEnrolled = true;
      }
    )
  };
  onClose = () =>{
    this.open = false;
  }
}