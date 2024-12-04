import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { FlatESLint } from 'eslint/use-at-your-own-risk';
import { jwtDecode } from 'jwt-decode';
import { Qano, qanos } from 'src/app/interface/formulario.rcv';
import {Estado, estados, PAIS, paises, Ciudad, Municipio, Parroquia, Marca, Modelo, Version} from 'src/app/interface/occidental'
import { OccidentalService } from 'src/app/services/occidental.service';

@Component({
  selector: 'app-plan-occidental-rcv',
  templateUrl: './plan-occidental-rcv.page.html',
  styleUrls: ['./plan-occidental-rcv.page.scss'],
})
export class PlanOccidentalRcvPage implements OnInit {

    /********* Varibales Consecutivas ********/
    formPlanRCV!:FormGroup;
    private fb = inject( FormBuilder );
    private navCtrl = inject( NavController );
    private toast = inject( ToastController );
    private occidentalService = inject( OccidentalService );
    public showLoading = false;
    private paisSeleccionado : string = '001';
    public estado: Estado [] = estados;
    public filteredEstado: Estado[] = [];
    private estadoSeleccionado : any;
    public ciudad : Ciudad [] = [];
    public filteredCiudad: Ciudad[] = [];
    private ciudadSeleccionado : any;
    public municipio : Municipio [] = [];
    public filteredMunicipio: Municipio[] = [];
    private municipioSeleccionado : any;
    public parroquia : Parroquia [] = [];
    public filteredParroquia: Parroquia[] = [];
    private parroquiaSeleccionado : any;
    public filteredAno: Qano[] = [];
    public qano : Qano [] = qanos;
    public marcas : Marca [] = [];
    public filteredMarca: Marca[] = [];
    private marcaSeleccionado : any;
    public modelo : Modelo[] = [];
    public filteredModelo: Modelo[] = [];
    private modeloSeleccionado : any;
    public version : Version[] = [];
    public filteredVersion: Version[] = [];
    private descripcion!:string;
    isNumIdReadonly: boolean = true;  // Por defecto, es solo lectura
    isPlacaReadonly: boolean = true;   // Por defecto, es solo lectura
    verificarCorreoControl: FormControl = new FormControl(''); // Control separado para "verificar correo"
    correoNoCoincide: boolean = false; // Variable para el error de coincidencia 
    correoCoincide: boolean = false

    constructor(
      private changedRefDef: ChangeDetectorRef
    ) {
      this.form()
    }

    ngAfterViewChecked() {
      this.changedRefDef.detectChanges();
    }

    verificarCoincidencia(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const correoVerificado = inputElement.value;
      
      const correoTomador = this.formPlanRCV.get('email')?.value;
      
      // Verificar si los correos coinciden
      this.correoNoCoincide = correoTomador !== correoVerificado;
      this.correoCoincide = correoTomador === correoVerificado; // Nueva propiedad para el éxito
    }

    
    validateEstado(): void {
      const estadoNumero = this.formPlanRCV.get('codestado')?.value;
      const estadoValido = this.estado.some(e => e.CODESTADO.toString() === estadoNumero);
      if (!estadoValido) {
        this.formPlanRCV.get('codestado')?.setValue('');
      }
    }
    
    validateCiudad(): void {
      const ciudadNumero = this.formPlanRCV.get('codciudad')?.value;
      const ciudadValido = this.ciudad.some(e => e.CODCIUDAD.toString() === ciudadNumero);
      if (!ciudadValido) {
        this.formPlanRCV.get('codciudad')?.setValue('');
      }
    }
    validateMunicipio(): void {
      const municipioNumero = this.formPlanRCV.get('codmunicipio')?.value;
      const municipioValido = this.municipio.some(e => e.CODMUNICIPIO.toString() === municipioNumero);
      if (!municipioValido) {
        this.formPlanRCV.get('codmunicipio')?.setValue('');
      }
    }

    validateParroquia(): void {
      const parroquiaNumero = this.formPlanRCV.get('codparroquia')?.value;
      const parroquiaValido = this.parroquia.some(e => e.CODPARROQUIA.toString() === parroquiaNumero);
      if (!parroquiaValido) {
        this.formPlanRCV.get('codparroquia')?.setValue('');
      }
    }

    validateAno(): void {
      const anoNumero = this.formPlanRCV.get('anmoveh')?.value;
      const anoValido = this.qano.some(e => e.qano.toString() === anoNumero);
      if (!anoValido) {
        this.formPlanRCV.get('anmoveh')?.setValue('');
      }
    }
    validateMarca(): void {
      const marcaNumero = this.formPlanRCV.get('marca')?.value;
      const marcaValido = this.marcas.some(e => e.CODMARCA.toString() === marcaNumero);
      if (!marcaValido) {
        this.formPlanRCV.get('marca')?.setValue('');
      }
    }
    validateModelo(): void {
      const modeloNumero = this.formPlanRCV.get('modelo')?.value;
      const modeloValido = this.modelo.some(e => e.CODMODELO.toString() === modeloNumero);
      if (!modeloValido) {
        this.formPlanRCV.get('modelo')?.setValue('');
      }
    }
    validateVersion(): void {
      const versionNumero = this.formPlanRCV.get('version')?.value;
      const versionValido = this.version.some(e => e.CODVERSION.toString() === versionNumero);
      if (!versionValido) {
        this.formPlanRCV.get('version')?.setValue('');
      }
    }

    /********** ESTADO *********/
    Estado(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredEstado = this.estado.filter(e => e.DESCESTADO.toLowerCase().includes(inputValue));
    }

    getDescripcionEstado() : string{
      const estadoNumero = this.formPlanRCV.get('codestado')?.value;
      const estado = this.estado.find(e => e.CODESTADO.toString() === estadoNumero);
      return estado ? estado.DESCESTADO : '';
    }

    async selectEstado(estado: Estado): Promise<void>{
      this.formPlanRCV.get('codestado')?.setValue(estado.CODESTADO.toString());
      this.formPlanRCV.get('codestado')?.markAsTouched();
      this.filteredEstado = [];

      const data = {
        codpais: this.paisSeleccionado,
        codestado: estado.CODESTADO.toString()
      }

      this.estadoSeleccionado = estado.CODESTADO.toString();

      try{
        const response = await (await this.occidentalService.ciudadOccidental(data)).toPromise();
             
        if(response){
          this.ciudad = response
        }else{
          this.estado = []; 
          console.error("El formato de respuesta de la API no es el esperado", response);
        }
        
      }catch (err){
          console.error("Error al obtener las ciudades:", err);
      }
    }

    /********** Select ciudad ***********/
     Ciudad(event: Event) : void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredCiudad = this.ciudad.filter(c => c.DESCCIUDAD.toLowerCase().includes(inputValue));
     }

     getDescriptionCiudad () : string {
      const ciudadNumero = this.formPlanRCV.get('codciudad')?.value;
      const ciudad = this.ciudad.find(c => c.CODCIUDAD.toString() === ciudadNumero);
      return ciudad ? ciudad.DESCCIUDAD : ''
     }

     async selectCiudad(ciudad:Ciudad) : Promise<void>{
      this.formPlanRCV.get('codciudad')?.setValue(ciudad.CODCIUDAD.toString());
      this.formPlanRCV.get('codciudad')?.markAsTouched();
      this.filteredCiudad = [];

      const data = {
        codpais: this.paisSeleccionado,
        codestado: this.estadoSeleccionado,
        codciudad: ciudad.CODCIUDAD.toString()
      }

      this.ciudadSeleccionado = ciudad.CODCIUDAD.toString();

      try{
        const response = await (await this.occidentalService.getMunicipio(data)).toPromise();
        this.municipio = response
        
      }catch (err) {
        console.error("Error al obtener los municipios:", err);
      }
     }

     /********* select municipio **********/

     Municipio(event: Event) : void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredMunicipio = this.municipio.filter(m => m.DESCMUNICIPIO.toLowerCase().includes(inputValue));
     }

     getDescriptionMunicipio () : string {
      const municipioNumero = this.formPlanRCV.get('codmunicipio')?.value;
      const municipio = this.municipio.find(m => m.CODMUNICIPIO.toString() === municipioNumero);
      return municipio ? municipio.DESCMUNICIPIO : ''
     }

     async SelectMunicipio(municipio: Municipio) :Promise<void>{
      this.formPlanRCV.get('codmunicipio')?.setValue(municipio.CODMUNICIPIO.toString());
      this.formPlanRCV.get('codmunicipio')?.markAsTouched();
      this.filteredMunicipio = [];

      const data = {
        codpais: this.paisSeleccionado,
        codestado: this.estadoSeleccionado,
        codciudad: this.ciudadSeleccionado,
        codmunicipio: municipio.CODMUNICIPIO.toString()
      }
      this.municipioSeleccionado = municipio.CODMUNICIPIO.toString();
     try{
      const response = await (this.occidentalService.getParroquia(data)).toPromise();
      
      this.parroquia = response

     }catch(err){
      console.error("Error al obtener las parroquias:", err);
     }
     }

     /*********** select parroquia *********/

     Parroquia(event: Event) : void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredParroquia = this.parroquia.filter(p => p.DESCPARROQUIA.toLowerCase().includes(inputValue));
     }

     getDescriptionParroquia () : string {
      const parroquiaNumero = this.formPlanRCV.get('codparroquia')?.value;
      const parroquia = this.parroquia.find(p => p.CODPARROQUIA.toString() === parroquiaNumero);
      return parroquia ? parroquia.DESCPARROQUIA : ''
     }

     async selectParroquia(parroquia: Parroquia) :Promise<void> {
      this.formPlanRCV.get('codparroquia')?.setValue(parroquia.CODPARROQUIA.toString());
      this.formPlanRCV.get('codparroquia')?.markAsTouched();
      this.filteredParroquia = [];
     }


     /*/********** año ****************/

     Ano(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value;
    
      // Filtrar los años comparando como cadenas
      if (inputValue) {
        this.filteredAno = this.qano.filter(año => año.qano.toString().includes(inputValue));
      } else {
        this.filteredAno = [];
      }
    
      if (this.filteredAno.length === 0) {
        this.formPlanRCV.get('anmoveh')?.setValue('');
      }
    }
    
    // Método para obtener la descripción del año seleccionado
    getAnoDescription(): string {
      const añoNumero = this.formPlanRCV.get('anmoveh')?.value;
      const año = this.qano.find(e => e.qano.toString() === añoNumero); // Comparar como cadena
    
      return año ? año.qano.toString() : '';
    }
    
    // Método para seleccionar un año de la lista de autocompletado
    async SelectAno(año: Qano): Promise<void> {
      this.formPlanRCV.get('anmoveh')?.setValue(año.qano.toString()); // Asegurarse de almacenar como cadena
      this.formPlanRCV.get('anmoveh')?.markAsTouched();
      this.filteredAno = [];
    
      const data = {
        descmarca: ''
      };
    
      try {
        const response = await (await this.occidentalService.getMarcas(data)).toPromise();
        this.marcas = response.response;
      } catch (err) {
        console.error("Error al obtener las Marcas:", err);
      }
    }
   

    /******** Marca  **********/

    Marca(event:Event) : void {
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredMarca = this.marcas.filter(m => m.DESCMARCA.toLowerCase().includes(inputValue));
    }

    getDescriptionMarca () : string {
      const marcaNumero = this.formPlanRCV.get('marca')?.value;
      const marca = this.marcas.find(m => m.CODMARCA.toString() === marcaNumero);
      return marca ? marca.DESCMARCA : ''
    }

    async selectMarca(marca:Marca) : Promise<void>{
      this.formPlanRCV.get('marca')?.setValue(marca.CODMARCA.toString());
      this.formPlanRCV.get('marca')?.markAsTouched();
      this.filteredMarca = [];

      const data = {
        marca: marca.CODMARCA.toString()
      }

      this.marcaSeleccionado = marca.CODMARCA.toString();

      try{
        const response = await (await this.occidentalService.getModelo(data)).toPromise();
        this.modelo = response.response
        
      }catch(err){
        console.error("Error al obtener el Modelo:", err);
      }
    }


    /************ MODELO **************/

    Modelo(event:Event): void{
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredModelo = this.modelo.filter(m => m.DESCMODELO.toLowerCase().includes(inputValue));
    }

    getDescriptionModelo () : string {
      const modeloNumero = this.formPlanRCV.get('modelo')?.value;
      const modelo = this.modelo.find(m => m.CODMODELO.toString() === modeloNumero);
      return modelo ? modelo.DESCMODELO : ''
    }

    async selectModelo(modelo:Modelo) : Promise<void>{
      this.formPlanRCV.get('modelo')?.setValue(modelo.CODMODELO.toString());
      this.formPlanRCV.get('modelo')?.markAsTouched();
      this.filteredModelo = [];

      const data = {
        marca :  this.marcaSeleccionado,
        modelo :  modelo.CODMODELO.toString()
      }
      this.modeloSeleccionado = modelo.CODMODELO.toString();

      try{
        const response = await (await this.occidentalService.getVersion(data)).toPromise()
        this.version = response.response
      }catch(err) {
        console.error("Error al obtener las versiones:", err);
      }

    }

    /********* VERSION **********/

    Version (event:Event) :void{
      const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.filteredVersion = this.version.filter(v => v.DESCVERSION.toLowerCase().includes(inputValue))
    }

    getDescriptionVersion () : string {
      const versionNumero = this.formPlanRCV.get('version')?.value;
      const version = this.version.find(v => v.CODVERSION.toString() === versionNumero);
      return version ? version.DESCVERSION : ''
    }

    async SelectVersion(version:Version) : Promise<void>{
      this.formPlanRCV.get('version')?.setValue(version.CODVERSION.toString());
      this.formPlanRCV.get('version')?.markAsTouched();
      this.filteredVersion = [];
    }

    /******** continuidad *******/
    private getCurrentDate(): string {
      const today = new Date();
    
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
    
      return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
    }
    
    /***** ReactiveForms *****/
    private form() {
      this.formPlanRCV = this.fb.group({
        codprod: new FormControl('AUTO'),
        codplan: new FormControl(''),
        revplan: new FormControl('000'),
        tipoid: new FormControl('',Validators.required), // tipo de documento
        numid: new FormControl('',Validators.required), //Numero de cedula
        dvid: new FormControl('0'),
        nomter: new FormControl('',Validators.required), // Nombre del tomador,
        apeter: new FormControl('',Validators.required), //apellido del tomador
        fecnac: new FormControl('',Validators.required), //fecha de nacimiento
        sexo: new FormControl('',Validators.required), // sexo
        email: new FormControl('',[Validators.required,Validators.email]), //email
        telofi: new FormControl('',[Validators.required,Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)]),
        codpais: new FormControl('001'),
        codestado: new FormControl('',Validators.required),
        codciudad: new FormControl('',Validators.required),
        codmunicipio: new FormControl('',Validators.required),
        codparroquia: new FormControl('',Validators.required),
        codsect: new FormControl(''),
        direccion: new FormControl('',Validators.required),
        marca: new FormControl('',Validators.required),
        modelo: new FormControl('',Validators.required),
        version: new FormControl('',Validators.required),
        claseVehiculos: new FormControl('000002'),
        anmoveh: new FormControl('',Validators.required),
        placa: new FormControl('',Validators.required),
        serialCarroceria: new FormControl('',Validators.required),
        serialMotor: new FormControl(''),
        clase: new FormControl('000002'),
        color: new FormControl('',Validators.required),
        kilometraje: new FormControl('',Validators.required),
        indnuevo: new FormControl('N'),
        fechaAdq: new FormControl(this.getCurrentDate()),
        tipocar: new FormControl('1'),
        tipodes: new FormControl('1'),
        zipecode: new FormControl('1010'),
        street: new FormControl('calle'),
        typeproperty: new FormControl('urb'),
        codinter: new FormControl ('060001'),
        idMasivo: new FormControl('dgfarm'),
        usuario: new FormControl('admin'),
        cuentaADomiciliar: new FormControl('0102148555258288488'),
        token: new FormControl('CF89CB6DFA2595E17F2AFB55006B3AFB')
      }); 
    }

    convertirFecha(fecha: string): string {
      const partes = fecha.split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    /******** Inicializador ********/
    ngOnInit() {
      const plan : any = localStorage.getItem('plan')
      const nPLan = JSON.parse(localStorage.getItem('nPlan') || '[]');
      this.formPlanRCV.patchValue({
        codplan: nPLan
      })
      const dataEmail : any = JSON.parse(localStorage.getItem('auth-session') || '[]')
      const email : any = jwtDecode(dataEmail.infoUser);
      console.log(email);
      this.formPlanRCV.get('email')?.setValue(email.email)
      this.descripcion = JSON.parse(plan)
      this.StorageDataFound();
      this.changedRefDef.detectChanges();
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
      const numeroCarnetSoloNumeros = CARNET.numero_de_cedula ? CARNET.numero_de_cedula.replace(/\D/g, '') : '';
    
      const placaValida = CARNET.placa && CARNET.placa.length <= 7 ? CARNET.placa : '';
    
      // Actualizar los campos de sólo lectura según la validación
      this.isNumIdReadonly = !!(numeroCedulaSoloNumeros || numeroLicenseSoloNumeros || numeroCarnetSoloNumeros);
      this.isPlacaReadonly = !!placaValida;

      const nombreLimpio = CEDULA.nombre
      ? CEDULA.nombre
          .replace(/FIRMA\s*TITULAR/g, '')   // Elimina "FIRMA TITULAR" con o sin espacios
          .replace(/FIRMATITULAR/g, '')      // Elimina "FIRMATITULAR" si está pegado
          .trim()                            // Elimina espacios adicionales
      : '';
    
      this.formPlanRCV.patchValue({
        nomter: nombreLimpio,
        apeter: CEDULA.apellido ?? LICENSE.apellido ?? '',
        numid: numeroCedulaSoloNumeros || numeroLicenseSoloNumeros || numeroCarnetSoloNumeros || '',
        color: CARNET.color ?? '',
        placa: placaValida || '',
        serialMotor: CARNET.serial_de_motor ?? '',
        serialCarroceria: CARNET.numero_carroceria ?? '',
      });
    }
    
    
    
  /***** Submit *****/
  async Submit() {
    this.showLoading = true;
    
    if (this.formPlanRCV.valid) {
        try {
            const data = this.formPlanRCV.value;
            const cedula = this.formPlanRCV.get('numid')?.value
            if (data.fecnac) {
                data.fecnac = this.convertirFecha(data.fecnac);
            }

            const response = await (await this.occidentalService.saveData(data)).toPromise();

            if (response) {
                if (response.desc_resp === "SUCCESS" && response.cod_resp === "0") {
                    localStorage.setItem('cedula-payment',JSON.stringify(cedula))
                    const plan = this.descripcion;
                    const fechaVencimiento = this.sumarUnAno();

                    await this.emailSend({
                        correo_titular: this.formPlanRCV.get('email')?.value,
                        fecha_emision: this.formPlanRCV.get('fechaAdq')?.value,
                        nombre_titular: this.formPlanRCV.get('nomter')?.value,
                        fecha_cobro: plan,
                        fecha_inicio: this.getCurrentDate(),
                        numero_poliza: '1',
                        fecha_vencimiento: fechaVencimiento
                    });

                    localStorage.setItem('occidental_poliza', JSON.stringify(response));
                    this.presentToast('Datos enviados perfectamente 😁, en breve será redirigido', 'success');
                    
                    setTimeout(() => {
                        this.navCtrl.navigateRoot('payment-occidental');
                    }, 2800);

                } else if (response.cod_resp === "2") {
                    // Placa ya registrada
                    this.presentToast('El vehículo ya tiene una póliza registrada en seguros la occidental”.😰', 'danger');
                    this.showLoading = false;

                } else {
                    // Otros errores
                    this.presentToast('Servicio no disponible en este momento. Por favor, intenta más tarde. 😰', 'danger');
                    this.showLoading = false;
                }
            } else {
                // Manejar si no hay respuesta
                this.presentToast('Error en el servidor, por favor, intenta más tarde. 😰', 'danger');
                this.showLoading = false;
            }

        } catch (err) {
            // Error de conexión o cualquier otro problema
            this.presentToast('Servicio No disponible 😰, intente más tarde', 'danger');
            this.showLoading = false;
        }
    } else {
        // Validación del formulario fallida
        this.presentToast('Completa todos los campos 😰, por favor', 'danger');
        this.formPlanRCV.markAllAsTouched();
        this.showLoading = false;
    }
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
   return this.navCtrl.navigateRoot(['occidental-vista'])
  }

}
