import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface ResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
};

@Injectable({providedIn: 'root'})
export class RegisterAuthService{
    constructor(private http: HttpClient){}
    signUp(email:string,password:string){
        return this.http.post<ResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDUbE7Lkw0LggCqyVRdc1hBW2f-zJ-cEgs",
        {
            email: email,
            password: password,
            returnSecureToken: true
        })
        .pipe(catchError( errorResponse =>{
            let errorMessage  = "An unknown error occurred!";
            if(!errorResponse.error || !errorResponse.error.error){
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message){
                case 'EMAIL_EXISTS':
                  errorMessage = "Sorry! This email already exist in database!";
                  break;
                case 'WEAK_PASSWORD : Password should be at least 6 characters':
                  errorMessage = "Your password is weak. It should be at least 6 characters!";
                  break;
            }
            return throwError(errorMessage);
        }));
    }
    sendUserData(userId:string,token:string,userData:{name: string, surname: string, phone: string,adress: string, pref: string,amountSpent: number}){
        this.http.put(`https://travelserbia-fc974.firebaseio.com/user/${userId}.json?auth=${token}`,
        userData
        ).subscribe(data=>{})
    }
}