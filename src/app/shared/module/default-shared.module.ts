import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { DirectiveInputMaskDirective } from '../directivas/directive-input-mask.directive';
import { DirectivePhoneMaskDirective } from '../directivas/directive-phone-mask.directive';
import { CedulaDirective } from '../directivas/cedula.directive';
import { FormatPlacaDirective } from '../directivas/format-placa.directive';
import { AlertComponent } from '../components/alert/alert.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    DirectiveInputMaskDirective,
    DirectivePhoneMaskDirective,
    CedulaDirective,
    FormatPlacaDirective,
    AlertComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    SpinnerComponent,
    DirectiveInputMaskDirective,
    DirectivePhoneMaskDirective,
    CedulaDirective,
    FormatPlacaDirective,
    AlertComponent
  ]
})
export class DefaultSharedModule { }
