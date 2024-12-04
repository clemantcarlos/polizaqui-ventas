  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { inject, Injectable } from '@angular/core';
  import { catchError, throwError, Observable, BehaviorSubject } from 'rxjs';
  import { environment } from 'src/environments/environment';
  import { tap } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private httpService = inject(HttpClient); 
    private apiUrl = environment.authService;
    private googleAuth = environment.google2Auth;
    private registerAuth = environment.registerService;
    private forgotPassword = environment.forgotPassword;

    
    // Estado de autenticación
    public loggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn: Observable<boolean> = this.loggedInSubject.asObservable();

    constructor() {
      const session = localStorage.getItem('auth-session');
      if (session) {
        this.loggedInSubject.next(true);
      } else {
        this.loggedInSubject.next(false);
      }
    }

    public async authentication(credentials: string) {
      return this.httpService.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        tap(response => {
          // Suponiendo que la autenticación es exitosa, actualizamos el estado de loggedIn
          this.loggedInSubject.next(true);
        }),
        catchError((err: HttpErrorResponse) => {
          let errMsg = 'Credenciales invalidas 🔑';
          if (err.status === 404 && err.error && err.error.error === 'Usuario no encontrado 😰') {
            errMsg = 'No se encontro el Usuario 😰';
          }
          return throwError({ status: err.status, message: errMsg });
        })
      );
    }

    public async registerAuthentication(credentials: string) {
      return this.httpService.post<any>(`${this.registerAuth}/register`, credentials).pipe(
        catchError((err: HttpErrorResponse) => {
          let errMsg = 'Credenciales invalidas 🔑';
          if (err.error && err.error.message === 'User Already Registered') {
            errMsg = 'No se pudo registrar el Usuario 😰';
          }
          return throwError({ status: err.status, message: errMsg });
        })
      );
    }

    public async forgotPasswordd(password: string) {
      return this.httpService.post<any>(`${this.forgotPassword}/forgot`, password).pipe(
        catchError((err: HttpErrorResponse) => {
          let errMsg = 'No se pudo actualizar la contraseña 😰, por favor intente de nuevo';
          if (err.status === 500) {
            return errMsg;
          }
          return throwError({ status: err.status, message: errMsg });
        })
      );
    }

    public googleAuthentication() {
      return window.location.href = this.googleAuth;
    }

    public facebookAuthentication() {
      return window.location.href = this.googleAuth;
    }

    public logout() {
      this.loggedInSubject.next(false);
      localStorage.removeItem('auth-session');
    }
  }
