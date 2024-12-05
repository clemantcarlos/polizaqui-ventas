import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
import {  Subscription, throwError } from 'rxjs';
import { Ciudad, Estado, estados } from 'src/app/interface/formulario.3en1';
import { InserDataService } from 'src/app/services/inser-data.service';
import { PolizaService } from 'src/app/services/poliza.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plan-funerario',
  templateUrl: './plan-funerario.page.html',
  styleUrls: ['./plan-funerario.page.scss'],
})
export class PlanFunerarioPage implements OnInit,AfterViewChecked {


  private navCtrl = inject(NavController);
  private fb = inject(FormBuilder);
  private insertData = inject( InserDataService );
  public isTitularDisabled = false;
  public formPlanSalud!: FormGroup;
  private tomadorSubscription: Subscription = new Subscription();
  private toastController = inject( ToastController );
  private polziaService = inject( PolizaService );
  public estados: Estado[] = estados;
  public filteredEstados: Estado[] = [];
  public filteredEstados2: Estado[] = [];
  public showLoading = false;
  public searchTerm : string = '';
  private getDatect : any;
  private http = inject(HttpClient)
  public ciudad: Ciudad [] = [];
  public filteredCiudades: Ciudad[] =[]
  public filteredCiudades2: Ciudad[] =[]
  private descripcion : string = ''
  private currentPolizaNumber!: number;
  private numeroObtenido : any;
  private email : any
  verificarCorreoControl: FormControl = new FormControl(''); // Control separado para "verificar correo"
  correoNoCoincide: boolean = false; // Variable para el error de coincidencia
  correoCoincide: boolean = false
  isSecondCheckboxChecked = false;

  constructor(
    private changeDftc: ChangeDetectorRef
  ) {
    this.generateForm();
    this.formPlanSalud.get('dec_term_y_cod')?.valueChanges.subscribe((value: boolean) => {
      this.formPlanSalud.get('dec_term_y_cod')?.setValue(value ? 1 : 0, { emitEvent: false });
    });
    this.formPlanSalud.get('dec_persona_politica')?.valueChanges.subscribe((value: boolean) => {
      this.formPlanSalud.get('dec_persona_politica')?.setValue(value ? 1 : 0, { emitEvent: false });
    });
  }

  toggleTextarea() {
    this.isSecondCheckboxChecked = !this.isSecondCheckboxChecked;
  }

  verificarCoincidencia(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const correoVerificado = inputElement.value;

    const correoTomador = this.formPlanSalud.get('correo_tomador')?.value;

    // Verificar si los correos coinciden
    this.correoNoCoincide = correoTomador !== correoVerificado;
    this.correoCoincide = correoTomador === correoVerificado; // Nueva propiedad para el éxito
  }
  toggleCheckboxes(selectedId: string, otherId: string) {
    const selectedCheckbox = document.getElementById(selectedId) as HTMLInputElement;
    const otherCheckbox = document.getElementById(otherId) as HTMLInputElement;

    // Si el checkbox seleccionado está marcado, desmarcar el otro
    if (selectedCheckbox.checked) {
      otherCheckbox.checked = false;
    }
  }

  getNextPolizaNumber(): number {
    // Obtiene el número de póliza almacenado o inicia en 1 si no existe
    let numberFromStorage = localStorage.getItem('currentPolizaNumber');
    this.currentPolizaNumber = numberFromStorage ? parseInt(numberFromStorage, 10) : 1;

    // Incrementa el número de póliza
    this.currentPolizaNumber++;

    // Guarda el número de póliza incrementado en localStorage
    localStorage.setItem('currentPolizaNumber', this.currentPolizaNumber.toString());

    return this.currentPolizaNumber;
  }

  ngAfterViewChecked() {
    this.changeDftc.detectChanges(); // Detecta cambios en la vista si es necesario
  }

 /*************DATOS DEL TOMADOR ************/

 /*************DATOS DEL TOMADOR ************/
 DescripcionT(): string {
  const estadoNumero = this.formPlanSalud.get('estado_tomador')?.value;
  const estado = this.estados.find(e => e.cestado === estadoNumero);
  return estado ? estado.xdescripcion_l : '';
}

EstadoT(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredEstados = this.estados.filter(estado =>
    estado.xdescripcion_l.toLowerCase().includes(inputValue)
  );

  // Limpiar la lista de ciudades al cambiar el estado
  this.filteredCiudades = [];
  this.formPlanSalud.get('ciudad_tomador')?.setValue('');
}


selectEstadoT(estado: Estado): void {
  this.formPlanSalud.get('estado_tomador')?.setValue(estado.cestado.toString());
  this.formPlanSalud.get('estado_tomador')?.markAsTouched();
  this.filteredEstados = [];

  const inputElement = document.querySelector('input[formControlName="estado_tomador"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = estado.xdescripcion_l;
  }

  // Filtrar ciudades por el estado seleccionado
  this.filteredCiudades = this.ciudad.filter(ciudad => ciudad.cestado === estado.cestado);

}

onCiudadT(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
  const estadoSeleccionado = this.formPlanSalud.get('estado_tomador')?.value;

  const estado = this.estados.find(e => e.cestado === Number(estadoSeleccionado));

  if (!estado) {
    console.log('No se encontró un estado válido.');
    this.filteredCiudades = [];
    return;
  }
  if (inputValue === '') {
    this.filteredCiudades = this.ciudad.filter(ciudad => ciudad.cestado === estado.cestado);
  } else {
    console.log('Filtrando ciudades para el estado y valor ingresado.');
    this.filteredCiudades = this.ciudad.filter(ciudad =>
      ciudad.xdescripcion_l.toLowerCase().includes(inputValue) &&
      ciudad.cestado === estado.cestado
    );
  }

}

selectCiudadT(ciudad: Ciudad): void {
  this.formPlanSalud.get('ciudad_tomador')?.setValue(ciudad.cciudad);
  this.formPlanSalud.get('ciudad_tomador')?.markAsTouched();
  this.filteredCiudades = [];

  const inputElement = document.querySelector('input[formControlName="ciudad_tomador"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = ciudad.xdescripcion_l;
  }
}

getCiudadDescripcion(): string {
  const ciudadNumero = this.formPlanSalud.get('ciudad_tomador')?.value;
  const ciudad = this.ciudad.find(c => c.cciudad === ciudadNumero);
  return ciudad ? ciudad.xdescripcion_l : '';
}


/*************DATOS DEL TITULAR ************/


DescripcionTI(): string {
  const estadoNumero = this.formPlanSalud.get('estado_titular')?.value;
  const estado = this.estados.find(e => e.cestado === estadoNumero);
  return estado ? estado.xdescripcion_l : '';
}

EstadoTI(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredEstados2 = this.estados.filter(estado =>
    estado.xdescripcion_l.toLowerCase().includes(inputValue)
  );

  // Limpiar la lista de ciudades al cambiar el estado
  this.filteredCiudades2 = [];
  this.formPlanSalud.get('ciudad_titular')?.setValue('');
}

selectEstadoTI(estado: Estado): void {
  this.formPlanSalud.get('estado_titular')?.setValue(estado.cestado.toString());
  this.formPlanSalud.get('estado_titular')?.markAsTouched();
  this.filteredEstados2 = [];

  const inputElement = document.querySelector('input[formControlName="estado_titular"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = estado.xdescripcion_l;
  }

  // Filtrar ciudades por el estado seleccionado
  this.filteredCiudades2 = this.ciudad.filter(ciudad => ciudad.cestado === estado.cestado);

}

onCiudadTI(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
  const estadoSeleccionado = this.formPlanSalud.get('estado_titular')?.value;

  const estado = this.estados.find(e => e.cestado === Number(estadoSeleccionado));

  if (!estado) {
    console.log('No se encontró un estado válido.');
    this.filteredCiudades2 = [];
    return;
  }
  if (inputValue === '') {
    this.filteredCiudades2 = this.ciudad.filter(ciudad => ciudad.cestado === estado.cestado);
  } else {
    console.log('Filtrando ciudades para el estado y valor ingresado.');
    this.filteredCiudades2 = this.ciudad.filter(ciudad =>
      ciudad.xdescripcion_l.toLowerCase().includes(inputValue) &&
      ciudad.cestado === estado.cestado
    );
  }
}

selectCiudadTI(ciudad: Ciudad): void {
  this.formPlanSalud.get('ciudad_titular')?.setValue(ciudad.cciudad);
  this.formPlanSalud.get('ciudad_titular')?.markAsTouched();
  this.filteredCiudades2 = [];

  const inputElement = document.querySelector('input[formControlName="ciudad_titular"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = ciudad.xdescripcion_l;
  }
}

getCiudadDescripcionTI(): string {
  const ciudadNumero = this.formPlanSalud.get('ciudad_titular')?.value;
  const ciudad = this.ciudad.find(c => c.cciudad === ciudadNumero);
  return ciudad ? ciudad.xdescripcion_l : '';
}





/******************************************* */

  private getCurrentDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private generateForm() {
    const nextPolizaNumber = this.getNextPolizaNumber();
    this.formPlanSalud = this.fb.group({
      poliza: new FormControl(''),
      plan: new FormControl('APP1'),
      canal_venta: new FormControl(''),
      cedula_tomador: new FormControl('',Validators.required),
      rif_tomador: new FormControl('',Validators.required),
      nombre_tomador: new FormControl('',Validators.required),
      apellido_tomador: new FormControl('',Validators.required),
      sexo_tomador: new FormControl('',Validators.required),
      estado_civil_tomador: new FormControl('',Validators.required),
      fnac_tomador: new FormControl('',Validators.required),
      estado_tomador: new FormControl('',Validators.required),
      ciudad_tomador: new FormControl('',Validators.required),
      direccion_tomador: new FormControl('',Validators.required),
      telefono_tomador: new FormControl('',[
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]),
      dec_persona_politica: new FormControl(false),
      dec_term_y_cod: new FormControl(false),
      dec_diagnos_enferm:new FormControl(0),
      dec_descrip_enferm: new FormControl(''),
      correo_tomador: new FormControl('',[Validators.required,Validators.email]),
      cedula_titular: new FormControl('',Validators.required),
      rif_titular: new FormControl('',Validators.required),
      nombre_titular: new FormControl('',Validators.required),
      apellido_titular: new FormControl('',Validators.required),
      sexo_titular: new FormControl('',Validators.required),
      estado_civil_titular: new FormControl('',Validators.required),
      fnac_titular: new FormControl('',Validators.required),
      estado_titular: new FormControl('',Validators.required),
      ciudad_titular: new FormControl('',Validators.required),
      direccion_titular: new FormControl('',Validators.required),
      telefono_titular: new FormControl('',[
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]),
      correo_titular: new FormControl('',[Validators.required,Validators.email]),
      productor: new FormControl('0'),
      frecuencia: new FormControl('A'),
      fecha_emision :  new FormControl(this.getCurrentDate()),
      sameAsTomador: new FormControl(false),
      asegurados: new FormArray([]),
      beneficiarios: new FormArray([]),

    });

    this.tomadorSubscription.add(
      this.formPlanSalud.get('sameAsTomador')!.valueChanges.subscribe(value => {
        this.onCheckboxChange(value);
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('cedula_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('cedula_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('rif_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('rif_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('nombre_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('nombre_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('apellido_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('apellido_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('sexo_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('sexo_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('estado_civil_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('estado_civil_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('fnac_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('fnac_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('estado_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          const estado = this.estados.find(e => e.cestado.toString() === value);
          if (estado) {
            this.formPlanSalud.get('estado_titular')!.setValue(estado.cestado.toString(), { emitEvent: false });

            // Actualizar el valor del input con la descripción del estado
            const inputElement = document.querySelector('input[formControlName="estado_titular"]') as HTMLInputElement;
            if (inputElement) {
              inputElement.value = estado.xdescripcion_l;
            }
          }
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('ciudad_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('ciudad_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('direccion_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('direccion_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('telefono_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('telefono_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanSalud.get('correo_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanSalud.get('correo_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

  }

  ngOnInit() {
    const plan : any = localStorage.getItem('Descripcion_products')
    this.descripcion = JSON.parse(plan)
    const emailInfo : any = JSON.parse(localStorage.getItem('auth-session') || '[]')
    const data : any = jwtDecode(emailInfo.infoUser)
    this.email = data.email
    this.storageData();
    this.getInfoData()
    this.getNumberPoliza()
    setTimeout(() => {
      this.updateNumberPoliza()
    }, 5000);
  }

  private async getNumberPoliza() {
    try {
        const response: any = await (await this.polziaService.getNumber()).toPromise();
        this.numeroObtenido = response.currentNumber;
    } catch (error) {
        console.error('Error fetching number:', error);
    }
}

private async updateNumberPoliza() {
    try {
        // Incrementar el número
        const newNumber = this.numeroObtenido + 1;
        const datos = { newNumber };

        // Enviar el nuevo número al backend
        const response: any = await (await this.polziaService.updateNumber(datos)).toPromise();

        // Actualizar el número local después de la respuesta
        this.numeroObtenido = newNumber;
        this.formPlanSalud.get('poliza')?.setValue(this.numeroObtenido)
        localStorage.setItem('numero',JSON.stringify(this.numeroObtenido));

    } catch (error) {
        console.error('Error updating number:', error);
    }
}

private storageData() {
  const StoredCedula: string | null = localStorage.getItem('documento_identidad');
  const CEDULA = StoredCedula ? JSON.parse(StoredCedula) : {};

  // Extraer solo los números de la cédula
  const numeroCedulaSoloNumeros = CEDULA.numero_de_cedula ? CEDULA.numero_de_cedula.replace(/\D/g, '') : '';

  // Limpiar el nombre y quitar "FIRMA TITULAR" (con o sin espacios)
  const nombreLimpio = CEDULA.nombre
    ? CEDULA.nombre
        .replace(/FIRMA\s*TITULAR/g, '')   // Elimina "FIRMA TITULAR" con o sin espacios
        .replace(/FIRMATITULAR/g, '')      // Elimina "FIRMATITULAR" si está pegado
        .trim()                            // Elimina espacios adicionales
    : '';

  this.formPlanSalud.patchValue({
    nombre_tomador: nombreLimpio,
    apellido_tomador: CEDULA.apellido ?? '',
    rif_tomador: numeroCedulaSoloNumeros ?? '',
  });
}


  onCheckboxChange(event: any) {
    const isChecked = event.detail.checked;
    this.isTitularDisabled = isChecked;
    if (isChecked) {
      this.copyTomadorToTitular();
    } else {
      this.clearTitularFields();
    }
  }

  private copyTomadorToTitular() {
    const tomador = this.formPlanSalud.value;
    this.formPlanSalud.patchValue({
      cedula_titular: tomador.cedula_tomador,
      rif_titular: tomador.rif_tomador,
      nombre_titular: tomador.nombre_tomador,
      apellido_titular: tomador.apellido_tomador,
      sexo_titular: tomador.sexo_tomador,
      estado_civil_titular: tomador.estado_civil_tomador,
      fnac_titular: tomador.fnac_tomador,
      estado_titular: tomador.estado_tomador,
      ciudad_titular: tomador.ciudad_tomador,
      direccion_titular: tomador.direccion_tomador,
      telefono_titular: tomador.telefono_tomador,
      correo_titular: tomador.correo_tomador,
    });
  }

  private clearTitularFields() {
    this.formPlanSalud.patchValue({
      cedula_titular: '',
      rif_titular: '',
      nombre_titular: '',
      apellido_titular: '',
      sexo_titular: '',
      estado_civil_titular: '',
      fnac_titular: '',
      estado_titular: '',
      ciudad_titular: '',
      direccion_titular: '',
      telefono_titular: '',
      correo_titular: '',
    });
  }

  routingNavigate() {
    this.navCtrl.navigateForward('9d3a6e2b1f7c4d8e5b9a4c7f8a1d2c9');
  }

  ngOnDestroy() {
    this.tomadorSubscription.unsubscribe();
  }

  private async toastMessage(message:string, color: 'danger'|'success'|'warning'){
    const toast = await this.toastController.create({
      message: message,
      duration:2000,
      position:'top',
      color: color
    })
    await toast.present()
  }
  public async Submit() {
    this.showLoading = true;

    if (this.formPlanSalud.valid) {
      localStorage.setItem('poliza_data', JSON.stringify(this.formPlanSalud.value))
      setTimeout(() => {
        this.toastMessage('Datos Enviados perfectamente 😁, en breve será redirigido', 'success');
        this.navCtrl.navigateRoot('1d4c5e7b3f9a8e2a6b0d9f3c7a1b4e8');
      }, 2000);
        // try {
        //     const response = await (await this.polziaService.emisionMundial(this.formPlanSalud.value)).toPromise();

        //     if (response.status === true) {
        //       const cnpoliza = response.data.cnpoliza;
        //       localStorage.setItem('cnpoliza', JSON.stringify(cnpoliza));
        //       const urlpoliza = response.data.urlpoliza;
        //       const plan = this.descripcion
        //       const fecha_inicio =  this.getCurrentDate()
        //       const numeroPoliza = this.formPlanSalud.get('poliza')?.value;
        //       const fechaVencimiento = this.sumarUnAno()

        //       await this.emailSend({
        //           correo_titular: this.formPlanSalud.get('correo_titular')?.value,
        //           poliza: cnpoliza,
        //           fecha_emision: this.formPlanSalud.get('fecha_emision')?.value,
        //           nombre_titular: this.formPlanSalud.get('nombre_titular')?.value,
        //           fecha_cobro: plan,
        //           urlpoliza: urlpoliza,
        //           fecha_inicio: fecha_inicio,
        //           numero_Poliza: numeroPoliza,
        //           fecha_vencimiento:fechaVencimiento
        //       });

        //       setTimeout(() => {
        //         this.savePoliza({
        //           fecha_emision: this.getCurrentDate(),
        //           fecha_expiracion: this.sumarUnAno(),
        //           estado_poliza: 'PENDIENTE',
        //           documento_poliza: urlpoliza,
        //           email_usuario: this.email,
        //           coberturas:{
        //           Cobertura_Total: "1000",
        //           },
        //           plan: 'Gastos funerarios',
        //           monto: '9',
        //           titular: this.formPlanSalud.get('nombre_titular')?.value,
        //           aseguradora: 'La mundial de Seguros',
        //           numero_poliza:cnpoliza,
        //           titular_apellido:this.formPlanSalud.get('apellido_tomador')?.value
        //         })
        //       }, 1000);



        //       setTimeout(() => {
        //         this.toastMessage('Datos Enviados perfectamente 😁, en breve será redirigido', 'success');
        //         this.navCtrl.navigateRoot('1d4c5e7b3f9a8e2a6b0d9f3c7a1b4e8');
        //       }, 2000);
        //     } else {
        //       if (response.message === "Se ha detectado la existencia de una póliza vigente con el mismo asegurado y ramo.") {
        //         this.toastMessage('Estimado usuario la póliza ya se encuentra registrada 😰.', 'danger');
        //       }
        //       this.showLoading = false;
        //     }
        // } catch (err) {
        //     if (err instanceof HttpErrorResponse) {
        //       if (err.status === 500  && err.error.message === "Se ha detectado la existencia de una póliza vigente con el mismo asegurado y ramo.") {
        //         this.toastMessage('Estimado usuario la póliza ya se encuentra registrada 😰, por favor intente de nuevo', 'danger');
        //       } else
        //       if(err.status === 500  && err.error.message === "El asegurado/titular no cumple con los criterios de edad para este plan. (Min: 0  , Max: 70 ).")
        //       {
        //         this.toastMessage('El asegurado/titular no cumple con los criterios de edad para este plan. (Min: 0  , Max: 70 )','warning')
        //       }
        //     }
        //     this.showLoading = false;
        // } finally {
        //     this.showLoading = false;
        // }
    } else {
      this.formPlanSalud.markAllAsTouched();
        this.toastMessage('Completa todos los campos 😰', 'danger');
        this.showLoading = false;
    }
}

private async savePoliza(data:any){
  const response = await (await this.insertData.savePoliza(data)).toPromise()
}

sumarUnAno(): Date {
  const fechaActual = new Date();

  const nuevaFecha = new Date(fechaActual);
  nuevaFecha.setFullYear(fechaActual.getFullYear() + 1);

  return nuevaFecha;
}

private async emailSend(data: any) {
  localStorage.setItem('Correo_Poliza',JSON.stringify(data))
}



public getInfoData() {
  return this.http.get<any>(`${environment.mailPoliza}/data`).subscribe((data:any) => {
    this.ciudad = data.data;
  })
  }

  isPoliticallyExposed: boolean = false;
  isIncomeDeclared: boolean = false;

  togglePoliticallyExposed() {
    this.isPoliticallyExposed = !this.isPoliticallyExposed;
  }

  toggleIncomeDeclaration() {
    this.isIncomeDeclared = !this.isIncomeDeclared;
  }
}
