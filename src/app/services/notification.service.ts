import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = environment.oneSignal; // Asegúrate de que este URL es el correcto
  private player_id: string | null = null; // Asegúrate de que el tipo es string o null

  constructor() {
    this.showStoredata()
}

  showStoredata() {
    this.player_id = localStorage.getItem('player_id');
  }

  public async sendNotification(data: any) {
    const { title, message} = data;    
    const notification = {
      app_id: "dbaccc51-69fd-404b-9f72-a14afe0fbfd2",
      headings: { "en": title },
      contents: { "en": message },
      include_player_ids: [this.player_id]
    };    
    fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZTU5YTQ3NTktYWJkMC00ZGMzLWJkMzUtN2EzNzVkODE2ZGJk'
      },
      body: JSON.stringify(notification)
    })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        console.error('Failed to send notification:', data.errors);
      } else {
      }
    })
    .catch(error => {
      console.error('Error sending notification:', error);
    });
  }
}
