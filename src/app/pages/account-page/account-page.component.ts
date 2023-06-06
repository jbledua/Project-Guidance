import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { ToolbarService } from '../../services/toolbar/toolbar.service'

import { User } from '../../models/user.model';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  currentUser: User | null = null;
  contacts: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toolbarService: ToolbarService
  ) { }

  async ngOnInit(): Promise<void> {
    this.toolbarService.changeTitle('Account');
    
    try {
      this.currentUser = await this.authService.getCurrentUser();
      if (this.currentUser) {
        const contactIds = await this.userService.getContacts(this.currentUser.id);
        for (let id of contactIds) {
          let contact = await this.userService.getUser(id);
          if (contact !== null) {
            this.contacts.push(contact);
          }
        }
      }
    } catch (error) {
      console.error('Error getting current user or contacts:', error);
    }
  }

  // You can add methods for updating user information here
}
