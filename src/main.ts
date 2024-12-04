import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TextractClient } from '@aws-sdk/client-textract'
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

if(environment.production){
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

const textractClient = new TextractClient({
  region: environment.awsConfig.region,
  credentials: {
    accessKeyId: environment.awsConfig.credentials.accessKeyId,
    secretAccessKey: environment.awsConfig.credentials.secretAccessKey
  }
});

