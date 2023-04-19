import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the pages
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { InboxPageComponent } from './pages/inbox-page/inbox-page.component';

// Import the AuthGuard
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'inbox', component: InboxPageComponent,canActivate: [AuthGuard],},
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: '/inbox', pathMatch: 'full' },
  { path: '**', component: NotfoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
