import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { trip } from '../trips/trip.model';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private dataService : DataService,private http : HttpClient) { }
  @ViewChild('tripForm') tripForm : NgForm;
  trips : trip[] = [];
  searchTrips : trip[] = [];
  searching = true;
  tripToUpdate : trip;
  user = JSON.parse(localStorage.getItem("user"));

  ngOnInit(): void {
    this.dataService.getTrips().subscribe(trips =>{this.trips = trips;});
  }
  onSubmitSearch(form : NgForm){
    const searchInput: HTMLFormElement = document.querySelector("#search");
    if(!searchInput.value) {return;}
    this.searching = false;
    this.tripToUpdate = this.trips.find( trip =>{ 
      return trip.id == searchInput.value.toLowerCase();
    });
    if(!this.tripToUpdate){
      alert("No such trip!");
      searchInput.value = "";
      this.searching = true;
      return;
    }
    this.tripForm.setValue({
      name: this.tripToUpdate.name,
      text: this.tripToUpdate.text,
      status: this.tripToUpdate.status,
      type: this.tripToUpdate.type,
      price: this.tripToUpdate.price,
      location: this.tripToUpdate.location,
      image: this.tripToUpdate.image,
      from: this.tripToUpdate.from,
      to: this.tripToUpdate.to
    });
  }
  onSubmitTrip(form : NgForm){
    if(this.tripForm.status == "VALID"){
      this.tripToUpdate.name = form.controls.name.value;
      this.tripToUpdate.text = form.controls.text.value;
      this.tripToUpdate.status = form.controls.status.value;
      this.tripToUpdate.type = form.controls.type.value;
      this.tripToUpdate.price = form.controls.price.value;
      this.tripToUpdate.location = form.controls.location.value;
      this.tripToUpdate.image = form.controls.image.value;
      this.tripToUpdate.from = form.controls.from.value;
      this.tripToUpdate.to = form.controls.to.value;
      this.http.patch(`https://travelserbia-fc974.firebaseio.com/trip/${this.tripToUpdate.id}.json?auth=${this.user._token}`,this.tripToUpdate).subscribe(data =>{this.searching = true;},error => {alert(error.error.error);this.searching = true;});
    }
  }
  search = (event) =>{
    const value = event.target.value.toUpperCase();
    if(value.length >= 1){
      this.searchTrips = this.trips.filter( trip =>{
        return trip.name.toUpperCase().includes(value);
      })
    }
  };
  lostFocus = () =>{
    setTimeout( () =>{
      this.searchTrips = [];
    },300)
  }
  chooseItem(event){
    const searchBox: HTMLFormElement = document.querySelector("#search");
    searchBox.value = event.target.innerText;
  }
}
