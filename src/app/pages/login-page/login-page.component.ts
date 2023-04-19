import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  // Declare a FormGroup variable
  loginForm: FormGroup; 

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  } // End of constructor()


  // Method to submit the login form
  submitLoginForm(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Call the login method from AuthService
      this.authService.login(email, password)
        .then((user) => {
          console.log('User logged in:', user);

          // Navigate to a different page or show a success message
          this.router.navigate(['/inbox']); // Replace '/dashboard' with the desired route
        })
        .catch((error) => {
          console.error('Error during login:', error);
          // Show an error message
        });
    }
  } // End of submitLoginForm()
  
}
