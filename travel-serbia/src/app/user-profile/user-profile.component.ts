import { Component, OnInit,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('form') myForm : NgForm;
  user = JSON.parse(localStorage.getItem("user"));
  email : string;
  phone: string;
  adress: string;
  fullname: string;

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.http.get<{name:string,surname:string,adress:string,phone:string,pref:string,amountSpent:string}>(`https://travelserbia-fc974.firebaseio.com/user/${this.user.id}.json?auth=${this.user._token}`).subscribe(respData=>{
        this.myForm.setValue({
          name: respData.name,
          surname: respData.surname,
          adress: respData.adress,
          email: JSON.parse(localStorage.getItem('user')).email,
          phone: respData.phone,
          preferences: respData.pref,
          spendAmount : respData.amountSpent
        });
        this.email = JSON.parse(localStorage.getItem('user')).email;
        this.adress = respData.adress;
        this.phone = respData.phone;
        this.fullname = respData.name + " " + respData.surname;
    })
  }
  onSubmit = () =>{
    if(this.myForm.status == "VALID"){
      const email = this.myForm.controls.email.value;
      const name = this.myForm.controls.name.value;
      const surname =  this.myForm.controls.surname.value;
      const phone =  this.myForm.controls.phone.value;
      const adress =  this.myForm.controls.adress.value;
      const pref =  this.myForm.controls.preferences.value;
      const amountSpent =  this.myForm.controls.spendAmount.value;

      const userInformation = {
         name  : name,
         surname :  surname,
         phone :  phone,
         adress :  adress,
         pref :  pref,
         amountSpent : amountSpent
      };
      this.http.patch(`https://travelserbia-fc974.firebaseio.com/user/${this.user.id}.json?auth=${this.user._token}`, userInformation)
      .subscribe(
        respData=>{ 
          localStorage.setItem("userInfo",JSON.stringify(userInformation));
          this.email = email;
          this.adress = adress;
          this.phone = phone;
          this.fullname = name + " " + surname;
        }
      )
      if(this.myForm.controls.email.dirty){
        this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDUbE7Lkw0LggCqyVRdc1hBW2f-zJ-cEgs",
        {
          idToken: this.user._token,
          email: email,
          returnSecureToken: true
        }
        ).subscribe(
          respData =>{ 
            let user =  JSON.parse(localStorage.getItem('user'));
            user.email = email;
            localStorage.setItem('user',JSON.stringify(user));
        },error =>{ console.log(error); alert(error.error.error.message);}
        )
      }
    }
  }
}
