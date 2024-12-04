import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(private router : Router, private navCtrl : NavController) { }
  selectedTab: number = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  exitNavigate(){
    this.navCtrl.navigateRoot('b4d9ef72dc4a9b91e8a1d6b9d1a423a7')
  }
  ngOnInit( ) {}

  isActive(tab: string) {
    return this.router.url === '/' + tab;
  }

}
