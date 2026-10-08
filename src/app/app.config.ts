import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideNgReflectAttributes, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideNgReflectAttributes(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyBu0YEpZbz354mdzrlgyZyoFYq5Af47pd8",
      authDomain: "to-do-list-5e865.firebaseapp.com",
      projectId: "to-do-list-5e865",
      storageBucket: "to-do-list-5e865.firebasestorage.app",
      messagingSenderId: "518640425581",
      appId: "1:518640425581:web:69365bc4ff781b34837d64",
      measurementId: "G-ZDGPF3BD8M"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};

