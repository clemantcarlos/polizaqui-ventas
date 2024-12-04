import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagePageRoutingModule } from './image-routing.module';

import { ImagePage } from './image.page';
import { OcrService } from 'src/app/services/ocr.service';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagePageRoutingModule,
    DefaultSharedModule,
    ReactiveFormsModule
  ],
  providers:[OcrService],
  declarations: [ImagePage]
})
export class ImagePageModule {}
