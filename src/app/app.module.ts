import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { DefaultSharedModule } from './shared/module/default-shared.module';
import { ChartbootComponent } from './shared/components/chartboot/chartboot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsComponent } from './shared/models/tabs/tabs.component';

@NgModule({
  declarations: [AppComponent,NotFoundComponent,ChartbootComponent,TabsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    DefaultSharedModule,
    ReactiveFormsModule,
    FormsModule
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },OneSignal],
  bootstrap: [AppComponent],
})
export class AppModule {}
