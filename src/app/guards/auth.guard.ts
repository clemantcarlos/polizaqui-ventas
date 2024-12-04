import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.isLoggedIn.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['b4d9ef72dc4a9b91e8a1d6b9d1a423a7']);
        }
      })
    );
  }
}
