import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  private excludedRoutes = ['b4d9ef72dc4a9b91e8a1d6b9d1a423a7', '72a639d5a9b4b4efb2c2b87a05fc84e5','auth/password-reset','8e5d9c7a4b1f2a3d6c4e9b3a7f8d1c2'];
  constructor(private router: Router) { }

  ngOnInit() {
    this.setupModalEvents();
  }

  private setupModalEvents() {
    const modal = document.getElementById('custom-modal')!;
    const closeButton = document.getElementById('close-modal')!;
    const confirmButton = document.getElementById('confirm-button')!;

    // Close the modal when clicking the close button
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      this.router.navigate(['b4d9ef72dc4a9b91e8a1d6b9d1a423a7']);
    });

    // Close the modal and redirect when clicking the confirm button
    confirmButton.addEventListener('click', () => {
      modal.style.display = 'none';
      this.router.navigate(['b4d9ef72dc4a9b91e8a1d6b9d1a423a7']);
    });

  }

  public showModal() {
    const modal = document.getElementById('custom-modal')!;
    modal.style.display = 'block';
  }
}
