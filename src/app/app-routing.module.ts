import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the pages
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ForgotPageComponent } from './pages/forgot-page/forgot-page.component';

import { InboxPageComponent } from './pages/inbox-page/inbox-page.component';
import { NewThreadPageComponent } from './pages/new-thread-page/new-thread-page.component';

// Import the AuthGuard
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: 'inbox', component: InboxPageComponent,canActivate: [AuthGuard]},
  { path: 'new-thread', component: NewThreadPageComponent,canActivate: [AuthGuard] },
  { path: 'register', component: RegisterPageComponent},
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot', component: ForgotPageComponent },
  { path: '', redirectTo: '/inbox', pathMatch: 'full' },
  { path: '**', component: NotfoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
