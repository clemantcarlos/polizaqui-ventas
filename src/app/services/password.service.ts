import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private httpService = inject( HttpClient );
  private apiUrl = environment.forgotPassword;

  constructor() { }

  public forgotPassword(email:string) {
    return this.httpService.post<any>(`${this.apiUrl}/forgot`,email).pipe(
      catchError((err : HttpErrorResponse) => {
        let errMsg = 'El usuario no se encuentra registrado 😰';
        if(err.status === 404) {
          return errMsg
        }
        return throwError(err);
      })
    )
  }
}
