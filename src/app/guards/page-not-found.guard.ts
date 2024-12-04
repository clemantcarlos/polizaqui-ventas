import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  private allowedRoutes = new Set([
    'products', 
    'confirmation/final', 
    'plan/ocr/data', 
    'plan/ocr/image-upload', 
    'plan/ocr/file-upload', 
    'plan/funerario', 
    'plan/salud', 
    'plan/rcv', 
    'formdata/rcv', 
    'formdata/funerario', 
    'formdata/salud', 
    'auth/password/recuperacion', 
    'plan/rcv/ocr', 
    'plan/path', 
    'plan/data/file/upload'
  ]);

  constructor(private router: Router, private navigationService: NavigationService) {
    // Detect when navigation starts
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Determine if the navigation is internal
        this.navigationService.disallowNavigation();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Reset navigationInternal after navigation ends or is cancelled
        this.navigationService.disallowNavigation();
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const routePath = state.url.substring(1); // Extract the path from the URL

    if (this.navigationService.isNavigationAllowed() || this.allowedRoutes.has(routePath)) {
      // Allow navigation if it is allowed or the route is in the allowed list
      return true;
    } else {
      // Navigation is not allowed, redirect to 'products'
      this.router.navigate(['**']);
      return false;
    }
  }
}
