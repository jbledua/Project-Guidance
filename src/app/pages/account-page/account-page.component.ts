import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.currentUser = await this.authService.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }

  // You can add methods for updating user information here
}
