import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InserDataService {

  private apiUrl = environment.insertData;
  private hhtpService = inject( HttpClient );

  constructor() { }

  /******* METODOS *******/


  public async saveTransactions(data: any): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return firstValueFrom(
      this.hhtpService.post<any>(`${this.apiUrl}/save/transaction`, data, { headers }).pipe(
        catchError((err: HttpErrorResponse) => {
          let msg = 'No se pudo registrar la transacción';
          if (err.error) {
            return throwError(() => new Error(msg));
          }
          return throwError(() => err);
        })
      )
    );
  }


  public saveMarcas(data:any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    this.hhtpService.post<any>(`${this.apiUrl}/save/marcas`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo registrar la marca';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err);
      })
    )
  }


  public saveModelo(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    this.hhtpService.post<any>(`${this.apiUrl}/save/modelos`,data,{headers}).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'No se pudo registrar el modelo';
        if(err.status === 404 && err.error){
          return msg;
        }
        return throwError(err);
      })
    )
  }


  public savePoliza(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return firstValueFrom(
      this.hhtpService.post<any>(`${this.apiUrl}/save/Poliza`, data, { headers }).pipe(
        catchError((err: HttpErrorResponse) => {
          let msg = 'No se pudo registrar la poliza';
          if (err.error) {
            return throwError(() => new Error(msg));
          }
          return throwError(() => err);
        })
      )
    );
  }


  public getPoliza() {
    const headers = new HttpHeaders({ 'Content-Type':'application/json'})
    return firstValueFrom(
      this.hhtpService.get<any>(`${this.apiUrl}/getPoliza`,{headers}).pipe(
        catchError((err:HttpErrorResponse) => {
          let msg = 'No se pudo obtener las polizas';
          if (err.error) {
            return throwError(() => new Error(msg));
          }
          return throwError(() => err);
        })
      )
    )
  }

  public updateStatus(data:any) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json'})
    return firstValueFrom(
      this.hhtpService.post<any>(`${this.apiUrl}/updatePoliza`,data,{headers}).pipe(
        catchError((err:HttpErrorResponse) => {
          let msg = 'No se pudo actualizar la polizas';
          if (err.error) {
            return throwError(() => new Error(msg));
          }
          return throwError(() => err);
        })
      ))
  }

}
