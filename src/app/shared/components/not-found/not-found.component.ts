import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent  implements OnInit {

  private navCtrl = inject( NavController );

  constructor() { }

  ngOnInit() {}

  goHome() {
    this.navCtrl.navigateRoot(['/']);
  }

}
