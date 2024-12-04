import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolizaService {

  private httpService = inject( HttpClient );
  private apiUrl = environment.mundialConnectionSalud;
  private marcaUlr = environment.marcaMundial;
  private modeloUlr = environment.modeloMundial;
  private versionUrl = environment.versionMundial;
  private apiNumber = environment.mailPoliza
  private token : string = '85872e57fb32c9e0c8a1f5fd52ff04aafdfbb8a33597b5d4739d418610885026'

  constructor() { }


  public async emisionMundial(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'apiKey': `${this.token}` });
    return this.httpService.post<any>(`${this.apiUrl}/api/v1/emissions/person`,data, {headers}).pipe(     
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo generar la poliza 😰, por favor intenta nuevamente'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }

  public async emisionMundialRcv(data:any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'apiKey':`${this.token}`});
    return this.httpService.post<any>(`${this.apiUrl}/api/v1/emissions/auto`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo generar la poliza 😰, por favor intenta nuevamente'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }

  /********** INFORMACION DE LA MUNDIAL */

  public async marcaMundial(data:any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpService.post<any>(`${this.marcaUlr}/api/v1/valrep/brand`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo obtener la información de la marca 😰'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }

  public async marcaMundialMoto(data:any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpService.post<any>(`${this.marcaUlr}/api/v1/valrep/brandMoto`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo obtener la información de la marca 😰'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }

  public async modeloMundial(data:any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpService.post<any>(`${this.modeloUlr}/api/v1/valrep/model`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo obtener la información del modelo 😰'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }


  public async versionMundial(data:any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpService.post<any>(`${this.versionUrl}/api/v1/valrep/version`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = 'No se pudo obtener la información de la version 😰'
        if(err.status === 404 && err.error){
          return errMsg
        }
        return throwError(err)
      })
    )
  }

  public async registerMundialPayment(data:any) {
    const headers =  new HttpHeaders({ 'Content-Type': 'application/json','apiKey':`${this.token}` })
    return this.httpService.post<any>(`${this.apiUrl}/api/v1/external/reportPayment`,data, {headers}).pipe(
      catchError ((err: HttpErrorResponse) => {
        let Msg = 'No se pudo procesar el pago 😰';
        if(err.error && err.status === 404){
          return Msg;
        }
        return throwError (err)
      })
    )
  }


  public async tasaMundial() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpService.get<any>(`${this.apiUrl}/api/v1/valrep/tasaBCV`).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'no se pudo obtener la tasa 😰' 
        if(err.error && err.status === 404) {
          return msg
        }
        return throwError (err)
      })
    )
  }


  public async getNumber() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.get(`${this.apiNumber}/increment`).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener el numero 😰';
        if(err.error && err.status === 500){
          return msg
        }
        return throwError (err);
      })
    )
  }

  public async updateNumber(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.post(`${this.apiNumber}/update`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo actualizar el numero 😰';
        if(err.error && err.status === 500){
          return msg
        }
        return throwError (err);
      })
    )
  }
  
}
