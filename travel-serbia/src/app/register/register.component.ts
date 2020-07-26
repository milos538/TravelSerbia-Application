import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterAuthService } from './register.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterAuthService) { }
  ngOnInit(): void {
  }
  isLoading = false;
  isFinished = false;
  message : {message: string, type: string};
  onSubmit = (form : NgForm) =>{
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    const name  = form.value.name;
    const surname = form.value.surname;
    const phone = form.value.phone;
    const adress = form.value.adress;
    const pref = form.value.preferences;
    const amountSpent = form.value.question;
    
    this.registerService.signUp(email,password).subscribe(
    responseData => {
      this.isLoading = false;
      this.isFinished = true;
      this.message = {message:"It is all done. Now you can go back to home page and log in!",type:"success"};
      const userData = {name: name, surname: surname, phone: phone,adress: adress,pref: pref,amountSpent:amountSpent};
      this.registerService.sendUserData(responseData.localId,responseData.idToken,userData);
    },
    errorMessage => {
      this.isLoading = false;
      this.isFinished = true;
      this.message =  {message: errorMessage , type:"error"};
    }
    );
    form.reset();
  }

}
