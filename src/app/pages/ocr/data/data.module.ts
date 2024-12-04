import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPageRoutingModule } from './data-routing.module';

import { DataPage } from './data.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { OcrService } from 'src/app/services/ocr.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPageRoutingModule,
    DefaultSharedModule
  ],
  providers:[OcrService],
  declarations: [DataPage]
})
export class DataPageModule {}
