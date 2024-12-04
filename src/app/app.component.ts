import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './services/alert.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private inactivityTimer: any;
  private readonly inactivityTime = 5 * 60 * 1000;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private platform: Platform
  ) {
    this.resetInactivityTimer();
    this.initializeBackButtonCustomHandler();
  }

  initializeBackButtonCustomHandler(): void {
    this.platform.backButton.subscribeWithPriority(9999, () => {
    });
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:scroll')
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.handleInactivity(), this.inactivityTime);
  }

  private handleInactivity() {
    this.alertService.showModal();
  }

  shouldShowToolbar(): boolean {
    return this.router.url !== '/b4d9ef72dc4a9b91e8a1d6b9d1a423a7' && this.router.url !== '/d9c67a47c4db8292cf4d24e2a9b8c9f2' && this.router.url !== '/72a639d5a9b4b4efb2c2b87a05fc84e5';
  }

}
