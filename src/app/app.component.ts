import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { MessageService } from './services/message/message.service';
import { ToolbarService } from './services/toolbar/toolbar.service';
import { Router, NavigationEnd } from '@angular/router';
import { User } from './models/user.model';

import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Project-Guidance';
  toolbarTitle = 'Project Guidance';
  isMenuOpen = false;  // Add this line

  // Add this new property
  showBackButton = true;

  currentUser: User | null = null;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public auth: AuthService,
    public msgService: MessageService,
    private toolbarService: ToolbarService,
    private router: Router
    ) { 
      this.toolbarService.currentTitle.subscribe(title => this.toolbarTitle = title);


      // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

      // Set showBackButton to true when on /thread or /account, false otherwise
      this.showBackButton = event.url.startsWith('/account')|| event.url.startsWith('/thread');
    
      }
    });

    // Get the current user
    this.auth.getCurrentUser().then((user) => {
      this.currentUser = user;
    }).catch((error) => {
      console.error('Error getting current user:', error);
    });
  }
  

  // Add this new method
  goBack(): void {
    this.router.navigate(['/inbox']); // replace '/inbox' with the appropriate page
  }

  public isLoggedIn(): boolean {
    return this.auth.isAuthenticated;
  }

  logout(): void {
    this.auth.logout()
      .then(() => {
        // handle successful logout, e.g., navigate to the login page
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // handle error during logout
        console.error('Error during logout:', error);
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.sidenav.toggle();
  }
}
