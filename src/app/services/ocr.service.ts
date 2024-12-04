import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  private httpService = inject( HttpClient );
  private apiFileUrl = environment.ocrFileService;
  private apiImageUrl = environment.ocrImageService;

  constructor() { }

  public uploadImage (image:Blob) {
    const formData = new FormData();
    formData.append('file',image,'image.jpeg');
    return this.httpService.post<{text:string}>(`${this.apiImageUrl}/upload-add`,formData)
  }

  public fileUpload ( image: Blob) {
    const formData = new FormData();
    formData.append('file',image,'image.jpeg');
    return this.httpService.post<{text:string}>(`${this.apiFileUrl}/adjuntar`,formData)
  }
}
