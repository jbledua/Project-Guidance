import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { AuthService } from '../../services/auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _formBuilder: FormBuilder
  ) {} // End of constructor()

  registerForm = this._formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  verifyForm = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  
  
}
