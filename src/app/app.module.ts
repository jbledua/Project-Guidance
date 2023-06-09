import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Pages Components
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { InboxPageComponent } from './pages/inbox-page/inbox-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NewThreadPageComponent } from './pages/new-thread-page/new-thread-page.component';
import { ForgotPageComponent } from './pages/forgot-page/forgot-page.component';

// Import ReactiveFormsModule for using FormBuilder
import { ReactiveFormsModule } from '@angular/forms';

// Import Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule}  from '@angular/material/divider';

import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule } from '@angular/material/progress-bar';

import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';


// Import Firebase packages
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Import AngularFire packages
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Import environment
import { environment } from './environments/environment';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { ThreadPageComponent } from './pages/thread-page/thread-page.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';

import {MatBadgeModule} from '@angular/material/badge';

import { MatMenuTrigger } from '@angular/material/menu';


// Initialize Firebase
const app = initializeApp(environment.firebase);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    NotfoundPageComponent,
    InboxPageComponent,
    RegisterPageComponent,
    NewThreadPageComponent,
    ForgotPageComponent,
    AccountPageComponent,
    ThreadPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatStepperModule,
    MatProgressBarModule,
    MatListModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    //provideFirebaseApp(() => initializeApp(environment.firebase,)), // <-- Initialize Firebase App
    provideFirestore(() => getFirestore()), // <-- Initialize Firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
