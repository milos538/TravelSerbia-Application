import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trip } from './trips/trip.model';
import { Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {

  constructor(private http: HttpClient) {}

  protected trips: Array<trip>;
  user = JSON.parse(localStorage.getItem("user"));

  public getTrips():Observable<Array<trip>>{
    return new Observable(observer => {
      if(this.trips){
        observer.next(this.trips);
        return observer.complete();
      }
      else{
        return this.http.get("https://travelserbia-fc974.firebaseio.com/trip.json")
        .subscribe( data =>{
          this.trips = Object.values(data);
          observer.next(this.trips);
          observer.complete();
        });
      }
    });
  }
  updateTrip(tripId:string, star: number){
    const tripToUpdate = this.trips.find( trip =>{ return trip.id == tripId});
    const studnetToUpdate = tripToUpdate.students.find( student => { return student.id == this.user.id })
    studnetToUpdate.star = star;
  }
  addStudent(tripId:string, userData: {name: string,surname: string, id: string}){
    console.log(this.trips);
    const tripToUpdate = this.trips.find( trip =>{ return trip.id == tripId});
    tripToUpdate.students[new Date().getTime()] = userData;
  }
  print(){
    console.log(this.trips);
  }
}