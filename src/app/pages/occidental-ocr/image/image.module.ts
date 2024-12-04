import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagePageRoutingModule } from './image-routing.module';

import { ImagePage } from './image.page';
import { HttpClientModule } from '@angular/common/http';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagePageRoutingModule,
    HttpClientModule,
    DefaultSharedModule
  ],
  declarations: [ImagePage]
})
export class ImagePageModule {}
