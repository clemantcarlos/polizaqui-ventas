import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DetectDocumentTextCommand, TextractClient } from '@aws-sdk/client-textract';
import { NavController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { OcrService } from 'src/app/services/ocr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage {
  title = 'Escanear Documento';
  text: string = ''; 
  showLoading: boolean = false;
  private toastController = inject(ToastController);
  private navCtrl = inject(NavController);
  private textractClient: TextractClient;
  imageUrl: string | null = null;
  private NotificationService = inject(NotificationService)
  isDisabled: boolean = false;
  public messageInformation : boolean = false;


  constructor(private ocrService: OcrService) {
    this.textractClient = new TextractClient({
      region: environment.awsConfig.region,
      credentials: {
        accessKeyId: environment.awsConfig.credentials.accessKeyId,
        secretAccessKey: environment.awsConfig.credentials.secretAccessKey
      }
    });
  }

  ngAfterViewInit() {
    this.startCamera();
  }

  async startCamera() {
    const video = document.getElementById('video') as HTMLVideoElement;
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    // Asegurarse de que el video se reproduzca inline en iOS
    video.setAttribute('playsinline', 'true');

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filtrar para cámaras traseras
        const rearCameras = devices.filter(device =>
          device.kind === 'videoinput' &&
          (device.label.toLowerCase().includes('back') ||
           device.label.toLowerCase().includes('rear'))
        );

        let rearCamera;

        if (rearCameras.length > 0) {
          rearCamera = rearCameras.find(camera => camera.label.toLowerCase().includes('main')) || rearCameras[0];
        }

        const constraints: any = {
          video: {
            facingMode: rearCamera ? { exact: 'environment' } : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        // Obtener el stream de video y asignarlo al elemento video
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
        };

      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        this.presentToast('No se pudo acceder a la cámara, intenta nuevamente.', 'danger');
      }
    } else {
      this.presentToast('La API de dispositivos no está disponible en este navegador.', 'danger');
    }
  }


  async requestCameraPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      console.error('Error al solicitar permiso de cámara:', err);
    }
  }
  
  
  capturePhoto() {
    this.showLoading = true;
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d'); 
    if (video && context) {  
      canvas.width = video.videoWidth ;
      canvas.height = video.videoHeight ;
      setTimeout(() => {
        context.drawImage(video, 0, 0); 
        canvas.toBlob((blob : any) => {  
          if (blob) {
            this.displayImage(blob);
            this.processImage(blob).then(() => {
              this.showLoading = false; 
            }).catch(() => {
              this.showLoading = false;
            });
          } else {
            this.showLoading = false;
          }
        }, 'image/jpeg');
      }, 200); 
    } else {
      this.showLoading = false;
    }
  }
  
  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  async processImage(file: Blob) {
    const currentScanType = localStorage.getItem('CURRENT_SCAN');
    this.showLoading = true;
    const isValid = await this.validateDocumentType(file, currentScanType);
    if (!isValid) {
      this.showLoading = false;
      this.messageInformation = false
      this.presentToast('La imagen capturada no coincide con el tipo de documento esperado.😞 Por favor, intente nuevamente.', 'warning');
      return;
    }
    this.ocrService.uploadImage(file).pipe(
      catchError((error: HttpErrorResponse) => {
        this.showLoading = false;
        if (error.status === 400) {
          this.showLoading=false
          this.presentToast('El archivo seleccionado no es un documento válido.😞 Por favor, suba un documento en el formato correcto.', 'danger');
          this.clearPreviousData();
          this.capturePhoto();
        } else {
          this.showLoading=false
          this.presentToast('Se produjo un error inesperado.😰 Por favor, inténtelo de nuevo.', 'danger');
          this.clearPreviousData();
          this.capturePhoto();
        }
        return throwError(error);
      })
    ).subscribe(
      (response: any) => {
        this.showLoading = false;        
        this.text = response;
        this.processDocumentText(this.text);
      }
    );
  }

  async validateDocumentType(file: Blob, currentScanType: string | null): Promise<boolean> {
    if (!currentScanType) {
      return false;
    }
    const text = await this.performOcr(file);
    if (currentScanType === 'licencia') {
      return /LICENCIA/.test(text) || /Licencia/.test(text);
    } else if (currentScanType === 'cedula') {
      return /VENEZOLANO/.test(text);
    } else if (currentScanType === 'carnet') {
      return /CERTIFICADO/.test(text) || /Certificado/.test(text);
    }
    return false;
  }
  async performOcr(file: Blob): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);     
      const command = new DetectDocumentTextCommand({
        Document: { Bytes: uint8Array }
      }); 
      const response = await this.textractClient.send(command);
      const text = response.Blocks
        ?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join(' ') || '';
      return this.cleanText(text);
  
    } catch (error) {
      throw new Error('Se produjo un error al procesar la imagen.😰 Por favor, intente nuevamente.');
    }
  }
  
  cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  processDocumentText(text: any) {
    const currentScanType = localStorage.getItem('CURRENT_SCAN');
    if (currentScanType && text) {
      const jsonString = JSON.stringify(text);
      let isValid = false; 
      if (currentScanType === 'licencia') {
        const ocrLicencia = JSON.parse(jsonString);
        isValid = this.validateJsonFields(ocrLicencia);
        if (isValid) {
          localStorage.setItem('OCR_LICENCIA', jsonString);
        }
      } else if (currentScanType === 'carnet') {
        const ocrCarnet = JSON.parse(jsonString);
        isValid = this.validateJsonFields(ocrCarnet);
        if (isValid) {
          localStorage.setItem('OCR_CARNET', jsonString);
        }
      } else if (currentScanType === 'cedula') {
        const ocrCedula = JSON.parse(jsonString);
        isValid = this.validateJsonFields(ocrCedula);
        if (isValid) {
          localStorage.setItem('OCR_CEDULA', jsonString);
        }
      }   
      if (isValid) {
        this.presentToast('Documento escaneado exitosamente.😁 Puede proceder al siguiente paso.', 'success');
        setTimeout(() => {
          this.requestNotification()
          setTimeout(() => {
            this.navCtrl.navigateRoot('2d4b8e3c1a7f9d5e6c9a4d8f3b1a7e2').then(() => {  
              window.location.reload()              
            })
          }, 3000);
        }, 2500);
      } else {
        this.handleValidationError(currentScanType);
      }
    } else {
      this.handleValidationError(currentScanType);
    }
  }

  requestNotification() : void {
    const notificationData = {
      title: '¡PolizAqui te informa 📢',
      message: `Documento procesado exitosamente 😁`,
    };
    this.NotificationService.sendNotification(notificationData);
  }
  
  validateJsonFields(jsonObject: any): boolean {
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key) && !jsonObject[key]) {
        return true;
      }
    }
    return true;
  }

  async handleValidationError(scanType: string | null) {
    await this.presentToast('La imagen no se procesó correctamente.😰 Por favor, intente nuevamente.', 'warning');  
    if (scanType) {
      switch(scanType) {
        case 'carnet':
          localStorage.removeItem('OCR_CARNET');
          setTimeout(() => {
            window.location.reload()
          }, 2800);  
          break;
      }
    }
  }

  clearPreviousData() {
    this.text = '';
  }

  RoutingNavigate(){
    this.navCtrl.navigateRoot('2d4b8e3c1a7f9d5e6c9a4d8f3b1a7e2');
  }

  displayImage(file: Blob) {
    this.messageInformation = true
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
      this.isDisabled = true; 
    };
    reader.readAsDataURL(file);
  }
}
