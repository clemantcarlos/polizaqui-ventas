import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor() { }

  public showModal() {
    const modal = document.getElementById('custom-modal')!;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public hideModal() {
    const modal = document.getElementById('custom-modal')!;
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
