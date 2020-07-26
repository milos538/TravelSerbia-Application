import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from '../user.model';

interface ResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
    registered : boolean
};

@Injectable({providedIn: 'root'})
export class LogInService{
    
    constructor(private http: HttpClient){}
    user = new Subject<User>();
    tokenExpirationTimer;
    
    signIn = (email:string, password:string) =>{
        return this.http.post<ResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDUbE7Lkw0LggCqyVRdc1hBW2f-zJ-cEgs",
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe( catchError( errorResponse => {
            let errorMessage  = "An unknown error occurred!";
            if(!errorResponse.error || !errorResponse.error.error){
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message){
                case 'EMAIL_NOT_FOUND':
                  errorMessage = "Sorry! No such email in our database!";
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = "Username/password is wrong. Try again!";
                  break;
                case 'USER_DISABLED':
                  errorMessage = "The user account has been disabled by an administrator.";
                  break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.':
                  errorMessage = "Too many unsuccessful login attempts. Try again in couple of minutes!";
                  break;
                case 'INVALID_EMAIL':
                  errorMessage = "Invalid email. Please try again.";
                  break;
                case 'MISSING_PASSWORD':
                  errorMessage = "Invalid password. Please try again.";
                  break;
            }
            return throwError(errorMessage);
        }), tap(resData =>{
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            const user = new User(resData.email, resData.localId,resData.idToken,expirationDate);
            localStorage.setItem('user', JSON.stringify(user));
            this.user.next(user);
            this.autoSignOut(+resData.expiresIn * 1000);
        }));
    }
    getUserInfo = () =>{
      const user = JSON.parse(localStorage.getItem("user"));
      this.http.get<{name:string,surname:string,adress:string,phone:string,pref:string,amountSpent:string}>(`https://travelserbia-fc974.firebaseio.com/user/${user.id}.json?auth=${user._token}`).subscribe(respData=>{
        localStorage.setItem("userInfo",JSON.stringify(respData));
      })
    }
    autoSignIn = () =>{
      const user:{email:string,id:string,_token:string,_tokenExpirationDate: string} = JSON.parse(localStorage.getItem('user'));
      if(!user){
        return;
      }
      const loadedUser = new User(user.email,user.id,user._token,new Date(user._tokenExpirationDate));
      if(loadedUser.token){
        this.user.next(loadedUser);
      }
    }
    signOut(){
      this.user.next(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
    }
    autoSignOut(timeUntilSignOut : number){
      this.tokenExpirationTimer = setInterval( () => {
        this.signOut();
      },timeUntilSignOut)
    }
}