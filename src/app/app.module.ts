import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Pages Components
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';


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

// Import Firebase packages
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Import environment
import { environment } from './environments/environment';
import { InboxPageComponent } from './pages/inbox-page/inbox-page.component';

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
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
