import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Project-Guidance';
  toolbarTitle = 'Project Guidance';

  constructor(
    public auth: AuthService,
    private router: Router
    ) { 
      // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateToolbarTitle(event.url);
      }
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
      // Add more cases as needed
      default:
        this.toolbarTitle = 'Project Guidance';
    }
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
    // Implement your menu toggle logic here
  }
}
