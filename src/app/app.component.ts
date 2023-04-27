import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
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
    private router: Router
    ) { 
      // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateToolbarTitle(event.url);

      // Set showBackButton to true when on /thread or /account, false otherwise
      this.showBackButton = ['/account'].includes(event.url) || event.url.startsWith('/thread');
    
      }
    });

    // Get the current user
    this.auth.getCurrentUser().then((user) => {
      this.currentUser = user;
    }).catch((error) => {
      console.error('Error getting current user:', error);
    });
  }

  // Update the toolbar title based on the current route
  updateToolbarTitle(url: string): void {
    switch (url) {
      case '/inbox':
        this.toolbarTitle = 'Inbox';
        break;
      case '/login':
        this.toolbarTitle = 'Login';
        break;
      case '/register':
        this.toolbarTitle = 'Register';
        break;
      case '/forgot':
        this.toolbarTitle = 'Forgot Password';
        break;
      case '/account':
        this.toolbarTitle = 'Account Settings';
        break;
      // Add more cases as needed
      default:
        this.toolbarTitle = 'Project Guidance';
    }
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
