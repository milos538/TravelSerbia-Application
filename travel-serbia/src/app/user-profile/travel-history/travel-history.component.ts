import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { trip } from '../../trips/trip.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-travel-history',
  templateUrl: './travel-history.component.html',
  styleUrls: ['./travel-history.component.scss']
})
export class TravelHistoryComponent implements OnInit{
  constructor(private tripData : DataService,private http : HttpClient,private router:Router,private route: ActivatedRoute) { }
  trips: trip[] = [];
  userTrips : trip[] = [];
  user = JSON.parse(localStorage.getItem("user"));
  isLoggedIn = false;
  isEnrolled = false;
  open = true;
  message = "Thank you for grading this trip!";

  ngOnInit(): void {
    this.http.get<Array<trip>>("https://travelserbia-fc974.firebaseio.com/trip.json")
    .subscribe(data =>{
    let temp = Object.values(data);
    this.userTrips = temp.filter( trip =>{
      if(!trip.hasOwnProperty('students')){
        return;
      }
      let finalStudents = [];
      Object.entries(trip.students).forEach( student =>{
        if(student[1].id == this.user.id){
          finalStudents.push({code:student[0],...student[1]});
        }
      });
      if(finalStudents.length == 1){
        trip.students = finalStudents;
        return trip;
      }
    })
    console.log(this.userTrips);
    })
  }
  rating(event){
    this.http.patch(`https://travelserbia-fc974.firebaseio.com/trip/${event.path[2].id}/students/${event.path[1].dataset.code}.json?auth=${this.user._token}`,{star: event.target.dataset.number})
    .subscribe( data =>{
      this.open = true;
      this.isEnrolled = true;
    })
  }
  onClose = () =>{
    this.open = false;
    this.router.navigate(['/']);
  }
}