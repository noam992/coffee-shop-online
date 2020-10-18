import { ActionType } from './../redux/action-type';
import { store } from './../redux/store';
//import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
//import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';



import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retryWhen} from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private myRouter: Router){}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Get token from localSession
    const token = sessionStorage.getItem('token')

    // Intercept method - add token to requests through header request  
    const reqWithAuth = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    // Interceptor, add for any request "Token" header
    // Catch error authentication from the "Token" header and handle it  
    return next.handle(reqWithAuth)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {

            // Error authentication
            // Move user to home page
            this.myRouter.navigate(['./home']);

            // Clear Items into Redux store
            store.dispatch({ type: ActionType.ClearAllItemCArtCart});
            
            // Remove "user" and "token" from session storage 
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");


            console.log(error.message)
            return throwError(error);
          }
        })
      );
  }

}
