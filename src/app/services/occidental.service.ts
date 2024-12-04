import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OccidentalService {

  private apiUrl = environment.occidentalApiData;
  private mailUrl = environment.mailOccidental
  private httpService = inject( HttpClient );
  public tokenOccidental : string = 'CF89CB6DFA2595E17F2AFB55006B3AFB';


  constructor() { }

  public estadOccidental(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getEstado`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener el estado 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  } 


  public ciudadOccidental(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getCiudad`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener la ciudad 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public getMunicipio (data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getMunicipio`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener el municipio 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public getParroquia(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getParroquia`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener la parroquia 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public getMarcas (data:any) {
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getMarcas`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener las marcas 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public getModelo (data:any) {
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getModelo`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener el modelo 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public getVersion(data:any) {
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/getVersion`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener la versión 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public saveData (data: any) {
    const headers = new HttpHeaders ({ 'content-type': 'application/json', 'Authorization': `Bearer ${this.tokenOccidental}`});
    return this.httpService.post<any>(`${this.apiUrl}/save`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo guardar los datos 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public getSavePayment(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json', 'Authorization': `Bearer ${this.tokenOccidental}`});
    return this.httpService.post<any>(`${this.apiUrl}/verifyOtp`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo obtener el OTP 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public postPayment(data:any) {
    const headers = new HttpHeaders ({ 'content-type': 'application/json', 'Authorization': `Bearer ${this.tokenOccidental}`});
    return this.httpService.post<any>(`${this.apiUrl}/savePayment`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo realizar el pago 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public verifyPayment(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json', 'Authorization': `Bearer ${this.tokenOccidental}`});
    return this.httpService.post<any>(`${this.apiUrl}/verifyPayment`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo verificar el pago 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public viewPoliza(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/viewPoliza`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo ver la póliza 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }


  public sendMail(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.mailUrl}/send`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo enviar el correo 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }

  public registerPayment(data:any){
    const headers = new HttpHeaders ({ 'content-type': 'application/json'});
    return this.httpService.post<any>(`${this.apiUrl}/register/payment`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo enviar el pago 😰';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err)
      })
    )
  }
}
