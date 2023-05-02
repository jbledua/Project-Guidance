import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UserService } from 'src/app/services/user/user.service';  // Import UserService
import { User } from 'src/app/models/user.model';  // Import User model

import {AuthService} from 'src/app/services/auth/auth.service';  // Import AuthService

@Component({
  selector: 'app-new-thread-page',
  templateUrl: './new-thread-page.component.html',
  styleUrls: ['./new-thread-page.component.scss']
})
export class NewThreadPageComponent implements OnInit {  // Implement OnInit
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public threadCtrl = new FormControl('');
  public filteredMembers: Observable<string[]> | undefined;
  public members: string[] = [];
  public contacts: string[] = [];

  public currentUser: User | null = null;

  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private authService: AuthService
    ) { }  // Inject UserService

    async ngOnInit(): Promise<void> {
      try {
        this.currentUser = await this.authService.getCurrentUser(); // Load current user
    
        if (this.currentUser) {
          this.contacts = await this.userService.getContacts(this.currentUser.id); // Load contacts
        }
      } catch (error) {
        console.error('Error getting contacts:', error);
      }
    
      this.filteredMembers = this.threadCtrl.valueChanges.pipe(
        startWith(null),
        map((member: string | null) => (member ? this._filter(member) : this.contacts.slice())),
      );
    }
    

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our member
    if (value) {
      this.members.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.threadCtrl.setValue(null);
  }

  remove(member: string): void {
    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.members.push(event.option.viewValue);
    this.memberInput.nativeElement.value = '';
    this.threadCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.contacts.filter(contact => contact.toLowerCase().includes(filterValue));
  }
}
