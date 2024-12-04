import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private httpService = inject( HttpClient );
  private mailService = environment.mailPoliza;

  constructor() { }

  public async mailPoliza(image:Blob) :Promise<Observable<any>>{
    return this.httpService.post(`${this.mailService}/preview`,image).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo enviar al correo la poliza emitida 😰'
        if(err.error && err.status === 404){
          return errMsg
        }
        return throwError(err)
      })
    )
  }
}
