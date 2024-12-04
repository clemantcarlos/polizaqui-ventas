import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private allowNavigation: boolean = false;

  allowNavigationThroughNavCtrl() {
    this.allowNavigation = true;
  }

  disallowNavigation() {
    this.allowNavigation = false;
  }

  isNavigationAllowed() {
    return this.allowNavigation;
  }
}
