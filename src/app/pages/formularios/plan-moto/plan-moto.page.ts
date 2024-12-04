import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { Ciudad, Estado, estados } from 'src/app/interface/formulario.3en1';
import { Marcas, Modelo, Qano, qanos, Version } from 'src/app/interface/formulario.rcv';
import { InserDataService } from 'src/app/services/inser-data.service';
import { PolizaService } from 'src/app/services/poliza.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plan-moto',
  templateUrl: './plan-moto.page.html',
  styleUrls: ['./plan-moto.page.scss'],
})
export class PlanMotoPage implements OnInit {

  /********* Varibales Consecutivas ********/
  formPlanRCV!:FormGroup;
  private fb = inject( FormBuilder );
  private navCtrl = inject( NavController );
  private toast = inject( ToastController );
  private insertData = inject( InserDataService );
  public showLoading = false;
  private polizaService = inject(PolizaService);
  public isTitularDisabled : boolean = false;
  private currentPolizaNumber!: number; 
  private tomadorSubscription: Subscription = new Subscription();
  public estados: Estado[] = estados;
  public ciudad : Ciudad [] = [];
  public filteredCiudades: Ciudad[] =[]
  public filteredCiudades2: Ciudad[] =[];
  public filteredEstados: Estado[] = [];
  public filteredEstados2: Estado[] = [];
  public filteredAno: Qano[] = [];
  private http = inject( HttpClient );
  public qano : Qano [] = qanos;
  private descripcion:string = ''
  public marcas : Marcas[] = [];
  public filteredMarca : Marcas[] = [];
  private añoSeleccionado : any
  private marcaSeleccionada : any;
  public modelo : Modelo[] =[];
  public filteredModelo : Modelo[] = [];
  private modeloSeleccionado: any;
  public version : Version [] = [];
  public filteredVersion : Version[] = [];
  private varsionSeleccionada : any;
  private numeroObtenido : any;
  private email : any
  verificarCorreoControl: FormControl = new FormControl(''); // Control separado para "verificar correo"
  correoNoCoincide: boolean = false; // Variable para el error de coincidencia 
  correoCoincide: boolean = false

  constructor(

    private changedRefDef: ChangeDetectorRef

  ) {
    this.form()
    this.formPlanRCV.get('dec_term_y_cod')?.valueChanges.subscribe((value: boolean) => {
      this.formPlanRCV.get('dec_term_y_cod')?.setValue(value ? 1 : 0, { emitEvent: false });
    });
    this.formPlanRCV.get('dec_persona_politica')?.valueChanges.subscribe((value: boolean) => {
      this.formPlanRCV.get('dec_persona_politica')?.setValue(value ? 1 : 0, { emitEvent: false });
    });
  }

  toggleCheckboxes(selectedId: string, otherId: string) {
    const selectedCheckbox = document.getElementById(selectedId) as HTMLInputElement;
    const otherCheckbox = document.getElementById(otherId) as HTMLInputElement;

    // Si el checkbox seleccionado está marcado, desmarcar el otro
    if (selectedCheckbox.checked) {
      otherCheckbox.checked = false;
    }
  }


  verificarCoincidencia(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const correoVerificado = inputElement.value;
    
    const correoTomador = this.formPlanRCV.get('correo_tomador')?.value;
    
    // Verificar si los correos coinciden
    this.correoNoCoincide = correoTomador !== correoVerificado;
    this.correoCoincide = correoTomador === correoVerificado; // Nueva propiedad para el éxito
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

   /*************DATOS DEL TOMADOR ************/ 
DescripcionT(): string {
  const estadoNumero = this.formPlanRCV.get('estado_tomador')?.value;
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
  this.formPlanRCV.get('ciudad_tomador')?.setValue('');
}


selectEstadoT(estado: Estado): void {
  this.formPlanRCV.get('estado_tomador')?.setValue(estado.cestado.toString());
  this.formPlanRCV.get('estado_tomador')?.markAsTouched();
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
  const estadoSeleccionado = this.formPlanRCV.get('estado_tomador')?.value;

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
  this.formPlanRCV.get('ciudad_tomador')?.setValue(ciudad.cciudad);
  this.formPlanRCV.get('ciudad_tomador')?.markAsTouched();
  this.filteredCiudades = [];
  
  const inputElement = document.querySelector('input[formControlName="ciudad_tomador"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = ciudad.xdescripcion_l;
  }
}

getCiudadDescripcion(): string {
  const ciudadNumero = this.formPlanRCV.get('ciudad_tomador')?.value;
  const ciudad = this.ciudad.find(c => c.cciudad === ciudadNumero);
  return ciudad ? ciudad.xdescripcion_l : '';
}


/*************DATOS DEL TITULAR ************/


DescripcionTI(): string {
  const estadoNumero = this.formPlanRCV.get('estado_titular')?.value;
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
  this.formPlanRCV.get('ciudad_titular')?.setValue('');
}

selectEstadoTI(estado: Estado): void {
  this.formPlanRCV.get('estado_titular')?.setValue(estado.cestado.toString());
  this.formPlanRCV.get('estado_titular')?.markAsTouched();
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
  const estadoSeleccionado = this.formPlanRCV.get('estado_titular')?.value;

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
  this.formPlanRCV.get('ciudad_titular')?.setValue(ciudad.cciudad);
  this.formPlanRCV.get('ciudad_titular')?.markAsTouched();
  this.filteredCiudades2 = [];
  
  const inputElement = document.querySelector('input[formControlName="ciudad_titular"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.value = ciudad.xdescripcion_l;
  }
}

getCiudadDescripcionTI(): string {
  const ciudadNumero = this.formPlanRCV.get('ciudad_titular')?.value;
  const ciudad = this.ciudad.find(c => c.cciudad === ciudadNumero);
  return ciudad ? ciudad.xdescripcion_l : '';
}


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

  public getInfoData() {
    return this.http.get<any>(`${environment.mailPoliza}/data`).subscribe((data:any) => {
      this.ciudad = data.data;
    })
    }

  /***** ReactiveForms *****/
  private form() {
    const nextPolizaNumber = this.getNextPolizaNumber();

    this.formPlanRCV = this.fb.group({
      poliza: new FormControl(''),
      plan: new FormControl(''),
      canal_venta: new FormControl(''),
      cedula_tomador: new FormControl('', Validators.required),
      rif_tomador: new FormControl('', Validators.required),
      nombre_tomador: new FormControl('', Validators.required),
      apellido_tomador: new FormControl('', Validators.required),
      sexo_tomador: new FormControl('', Validators.required),
      estado_civil_tomador: new FormControl('', Validators.required),
      fnac_tomador: new FormControl('', Validators.required),
      estado_tomador: new FormControl('', Validators.required),
      ciudad_tomador: new FormControl('', Validators.required),
      direccion_tomador: new FormControl('', Validators.required),
      telefono_tomador: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]),
      correo_tomador: new FormControl('', [Validators.required,Validators.email]),
      cedula_titular: new FormControl('', Validators.required),
      rif_titular: new FormControl('', Validators.required),
      nombre_titular: new FormControl('', Validators.required),
      apellido_titular: new FormControl('', Validators.required),
      sexo_titular: new FormControl('',Validators.required),
      estado_civil_titular: new FormControl('', Validators.required),
      fnac_titular: new FormControl('', Validators.required),
      estado_titular: new FormControl('', Validators.required),
      ciudad_titular: new FormControl('', Validators.required),
      direccion_titular: new FormControl('', Validators.required),
      telefono_titular: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]),
      dec_persona_politica: new FormControl(false),
      dec_term_y_cod: new FormControl(false),
      correo_titular: new FormControl('', [Validators.required,Validators.email]),
      marca: new FormControl('',Validators.required),
      modelo: new FormControl('',Validators.required),
      version: new FormControl('',Validators.required),
      año: new FormControl('',Validators.required),
      color: new FormControl('',Validators.required),
      placa: new FormControl('',Validators.required),
      serial_carroceria: new FormControl('',Validators.required),
      serial_motor: new FormControl('',Validators.required),
      productor: new FormControl('0'),
      frecuencia: new FormControl('A'),
      fecha_emision: new FormControl(this.getCurrentDate()),
      sameAsTomador: new FormControl(false),
    });
    this.tomadorSubscription.add(
      this.formPlanRCV.get('sameAsTomador')!.valueChanges.subscribe(value => {
        this.onCheckboxChange(value);
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('cedula_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('cedula_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('rif_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('rif_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('nombre_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('nombre_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('apellido_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('apellido_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('sexo_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('sexo_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('estado_civil_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('estado_civil_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('fnac_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('fnac_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('estado_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          const estado = this.estados.find(e => e.cestado.toString() === value);
          if (estado) {
            this.formPlanRCV.get('estado_titular')!.setValue(estado.cestado.toString(), { emitEvent: false });  
            const inputElement = document.querySelector('input[formControlName="estado_titular"]') as HTMLInputElement;
            if (inputElement) {
              inputElement.value = estado.xdescripcion_l;
            }
          }
        }
      })
    );
    

    this.tomadorSubscription.add(
      this.formPlanRCV.get('ciudad_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('ciudad_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('direccion_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('direccion_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('telefono_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('telefono_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );

    this.tomadorSubscription.add(
      this.formPlanRCV.get('correo_tomador')!.valueChanges.subscribe(value => {
        if (this.isTitularDisabled) {
          this.formPlanRCV.get('correo_titular')!.setValue(value, { emitEvent: false });
        }
      })
    );
  }

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked; 
    this.isTitularDisabled = isChecked;
    if (isChecked) {
      this.copyTomadorToTitular();
    } else {
      this.clearTitularFields();
    }
  }

 /************* AÑO/MARCA *************/

Ano(event: Event): void {
const inputValue = (event.target as HTMLInputElement).value;
const yearNumber = parseInt(inputValue, 10);

if (!isNaN(yearNumber)) {
  this.filteredAno = this.qano.filter(año => año.qano.toString().includes(yearNumber.toString()));
} else {
  this.filteredAno = [];
}

if (this.filteredAno.length === 0) {
  this.formPlanRCV.get('año')?.setValue(''); 
}
}

// Método para obtener la descripción del año seleccionado
getAnoDescription(): string {
const añoNumero = this.formPlanRCV.get('año')?.value;
const año = this.qano.find(e => e.qano === añoNumero);

return año ? año.qano.toString() : '';
}

// Método para seleccionar un año de la lista de autocompletado
async SelectAno(año: Qano): Promise<void> {
this.formPlanRCV.get('año')?.setValue(año.qano); 
this.formPlanRCV.get('año')?.markAsTouched();
this.filteredAno = [];

const data = { qano: año.qano.toString() };
this.añoSeleccionado = año.qano;

try {
  const response = await (await this.polizaService.marcaMundialMoto(data)).toPromise();

  if (response && response.data && Array.isArray(response.data.brand)) { 
    this.marcas = response.data.brand; 
  } else {
    this.marcas = []; 
    console.error("El formato de respuesta de la API no es el esperado", response);
  }
  
} catch (error) {
  console.error("Error al obtener las marcas:", error);
}
}
/************* MARCA/MODELO *************/

// Método para filtrar marcas al escribir
Marca(event: Event): void {
const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
this.filteredMarca = this.marcas.filter(marca => marca.xmarca.toLowerCase().includes(inputValue));

if (this.filteredMarca.length === 0) {
  this.formPlanRCV.get('marca')?.setValue('');
}
}

getDescripcionMarca(): string {
const marcaNumero = this.formPlanRCV.get('marca')?.value;
const marca = this.marcas.find(e => e.cmarca.toString() === marcaNumero);
return marca ? marca.xmarca : '';
}

// Método para seleccionar una marca de la lista de autocompletado
async selectMarca(marca: Marcas): Promise<void> {
this.formPlanRCV.get('marca')?.setValue(marca.cmarca.toString());
this.formPlanRCV.get('marca')?.markAsTouched();
this.filteredMarca = [];

const data = { qano: this.añoSeleccionado, cmarca: marca.cmarca };

this.marcaSeleccionada = marca.cmarca

try {
  const response = await (await this.polizaService.modeloMundial(data)).toPromise();

  if(response && response.data && Array.isArray(response.data.model)){
    this.modelo = response.data.model; 
  }else{
    this.modelo = []; 
    console.error("El formato de respuesta de la API no es el esperado", response);
  }
} catch (err) {
  console.error("Error al obtener los modelos:", err); 
}
}

    /************* MODELO/VERSION *************/

    Modelo(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredModelo = this.modelo.filter(modelo => modelo.xmodelo.toLowerCase().includes(inputValue));
      
      if (this.filteredModelo.length === 0) {
        this.formPlanRCV.get('modelo')?.setValue('');  // Limpia el FormControl si no hay resultados
      }
    }
    
    getDescripcionModelo(): string {
      const modeloNumero = this.formPlanRCV.get('modelo')?.value;
      const modelo = this.modelo.find(e => e.cmodelo.toString() === modeloNumero); 
      return modelo ? modelo.xmodelo : ''; 
    }
    
    async selectModelo(modelo: Modelo): Promise<void> {
      // Establecer el modelo seleccionado en el FormControl
      this.formPlanRCV.get('modelo')?.setValue(modelo.cmodelo.toString());
      this.formPlanRCV.get('modelo')?.markAsTouched();
      
      // Limpiar la lista filtrada
      this.filteredModelo = []; 
    
      // Prepara el objeto de datos para la solicitud al servicio
      const data = { qano: this.añoSeleccionado, cmarca: this.marcaSeleccionada, cmodelo: modelo.cmodelo };
      
      this.modeloSeleccionado = modelo.cmodelo; // Guardar el modelo seleccionado
    
      try {
        const response = await (await this.polizaService.versionMundial(data)).toPromise(); // Solicitar las versiones al servicio
        
        if (response && response.data && Array.isArray(response.data.version)) {
          this.version = response.data.version;
        } else {
          this.version = []; 
          console.error("El formato de respuesta de la API no es el esperado", response);
        }
      } catch (err) {
        console.error("Error al obtener los modelos:", err); 
      }
    }
    
    

    /************ MODELIO/VERSION ***********/

    Version(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredVersion = this.version.filter(version => version.xversion.toLowerCase().includes(inputValue));
      
      if (this.filteredVersion.length === 0) {
        this.formPlanRCV.get('version')?.setValue('');
      }
    }

    getDescripcionVersion(): string {
      const versionNumero = this.formPlanRCV.get('version')?.value;
      const version = this.version.find(e => e.cversion.toString() === versionNumero);
      return version ? version.xversion : '';
    }

    async selectVersion(version:Version): Promise<void> {
      this.formPlanRCV.get('version')?.setValue(version.cversion.toString());
      this.formPlanRCV.get('version')?.markAsTouched();
      this.filteredVersion = [];


    }


  private copyTomadorToTitular() {
    const tomador = this.formPlanRCV.value;
    this.formPlanRCV.patchValue({
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
    this.formPlanRCV.patchValue({
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
  

 
  /******** Inicializador ********/
  ngOnInit() {
    const plan : any = localStorage.getItem('Descripcion_products')
    this.descripcion = JSON.parse(plan)
    const emailInfo : any = JSON.parse(localStorage.getItem('auth-session') || '[]')
    const data11 : any = jwtDecode(emailInfo.infoUser)
    this.email = data11.email
    this.StorageDataFound();
    this.getInfoData();
    this.changedRefDef.detectChanges();
    const info : any = localStorage.getItem('plan')
    const data = JSON.parse(info)
    this.formPlanRCV.get('plan')?.setValue(data)
    this.getNumberPoliza()
    setTimeout(() => {
      this.updateNumberPoliza()
    }, 5000);  
  }

  private async getNumberPoliza() {
    try {
        const response: any = await (await this.polizaService.getNumber()).toPromise();
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
        const response: any = await (await this.polizaService.updateNumber(datos)).toPromise();
        
        // Actualizar el número local después de la respuesta
        this.numeroObtenido = newNumber;
        this.formPlanRCV.get('poliza')?.setValue(this.numeroObtenido)
        localStorage.setItem('numero',JSON.stringify(this.numeroObtenido));
        
    } catch (error) {
        console.error('Error updating number:', error);
    }
}


  /*********************************************/
  /******** toastController Messages ***********/
  /*********************************************/

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }


  /*********************************************/
  /******** StorageAsegurado ***********/
  /*********************************************/

  private StorageDataFound() {
    const StoredLicense: string | null = localStorage.getItem('OCR_LICENCIA');
    const StoredCarnet: string | null = localStorage.getItem('OCR_CARNET');
    const StoredCedula: string | null = localStorage.getItem('OCR_CEDULA');
  
    const LICENSE = StoredLicense ? JSON.parse(StoredLicense) : {};
    const CARNET = StoredCarnet ? JSON.parse(StoredCarnet) : {};
    const CEDULA = StoredCedula ? JSON.parse(StoredCedula) : {};
  
    const numeroCedulaSoloNumeros = CEDULA.numero_de_cedula ? CEDULA.numero_de_cedula.replace(/\D/g, '') : '';
    const numeroLicenseSoloNumeros = LICENSE.numero_de_cedula ? LICENSE.numero_de_cedula.replace(/\D/g, '') : '';
    const numerocEDULASoloNumeros = CARNET.numero_de_cedula ? CARNET.numero_de_cedula.replace(/\D/g, '') : '';
  
    // Limpiar el nombre y eliminar "FIRMA TITULAR" incluso si está pegado al nombre
    const nombreLimpio = (CEDULA.nombre ?? LICENSE.nombre ?? '')
      .replace(/FIRMA\s*TITULAR/g, '')   // Elimina "FIRMA TITULAR" con o sin espacios
      .replace(/FIRMATITULAR/g, '')      // Elimina "FIRMATITULAR" si está pegado
      .trim();
  
    const apellidoLimpio = (CEDULA.apellido ?? LICENSE.apellido ?? '')
      .replace(/FIRMA\s*TITULAR/g, '')   // Elimina "FIRMA TITULAR" con o sin espacios
      .replace(/FIRMATITULAR/g, '')      // Elimina "FIRMATITULAR" si está pegado
      .trim();
  
    this.formPlanRCV.patchValue({
      nombre_tomador: nombreLimpio,
      apellido_tomador: apellidoLimpio,
      rif_tomador: numeroCedulaSoloNumeros ?? numeroLicenseSoloNumeros ?? numerocEDULASoloNumeros ?? '',
      color: CARNET.color ?? '',
      placa: CARNET.placa ?? '',
      serial_motor: CARNET.serial_de_motor ?? '',
      serial_carroceria: CARNET.numero_carroceria ?? '',
    });
  }
  


  ngOnDestroy() {
    this.tomadorSubscription.unsubscribe();
  }
      
/***** Submit *****/
async Submit() {
    this.showLoading = true;
    if(this.formPlanRCV.valid){
      try{
        const response = await (await this.polizaService.emisionMundialRcv(this.formPlanRCV.value)).toPromise();
        
        if(response.status === true){
          const cnpoliza = response.data.cnpoliza
          localStorage.setItem('cnpoliza', JSON.stringify(cnpoliza));
          const urlpoliza = response.data.urlpoliza;
          const plan = this.descripcion;
          const fecha_inicio =  this.getCurrentDate()
          const numeroPoliza = this.formPlanRCV.get('poliza')?.value;
          const fechaVencimiento = this.sumarUnAno();
          await this.emailSend({
            correo_titular: this.formPlanRCV.get('correo_tomador')?.value,
            poliza: cnpoliza,
            fecha_emision: this.formPlanRCV.get('fecha_emision')?.value,
            nombre_titular: this.formPlanRCV.get('nombre_titular')?.value,
            fecha_cobro: plan,
            urlpoliza: urlpoliza,
            fecha_inicio: fecha_inicio,
            numero_Poliza: numeroPoliza,
            fecha_vencimiento:fechaVencimiento
          })
          setTimeout(() => {
            this.savePoliza({
              fecha_emision: this.getCurrentDate(),
              fecha_expiracion: this.sumarUnAno(),
              estado_poliza: 'PENDIENTE',
              documento_poliza: urlpoliza,
              email_usuario: this.email,
              coberturas:{                          
                RCV_daños_personas: "2.505",
                RCV_daños_cosas: "2.000",
                Club_ARYS_basico: 'incluido'
              },
              plan: 'R.C.V motos',
              monto: '20',
              titular: this.formPlanRCV.get('nombre_titular')?.value,
              aseguradora: 'La mundial de Seguros',
              numero_poliza:cnpoliza,
              titular_apellido:this.formPlanRCV.get('apellido_tomador')?.value
            })
          }, 1000);



          setTimeout(() => {
            this.presentToast('Datos Enviados perfectamente 😁, en breve será redirigido', 'success');
            this.navCtrl.navigateRoot('1d4c5e7b3f9a8e2a6b0d9f3c7a1b4e8');
          }, 2000);
        }else{
          this.presentToast('Estimado usuario la poliza ya se encuentra registrada 😰, por favor intente de nuevo', 'danger');
          this.showLoading = false
        }
      }catch(err){
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.presentToast('Estimado usuario la poliza ya se encuentra registrada 😰, por favor intente de nuevo', 'danger');
          this.showLoading = false
        } else {
          this.presentToast('Estimado usuario la poliza ya se encuentra registrada 😰, por favor intente de nuevo', 'danger');
          this.showLoading = false
        }
      }
    }else{
      this.formPlanRCV.markAllAsTouched();
      this.presentToast('Completa todos los campos 😰', 'danger');
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

public routingNavigate() {
 return this.navCtrl.navigateRoot(['2d4b8e3c1a7f9d5e6c9a4d8f3b1a7e2'])
}

}
