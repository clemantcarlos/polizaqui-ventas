import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private navCtrl = inject(NavController)

  constructor() { }

  ngOnInit() {
  }



  routingNavigateMundial(){
    this.navCtrl.navigateRoot('products')
  }

  routingNavigateOccidental(){
    this.navCtrl.navigateRoot('products-occidental')
  }

}
