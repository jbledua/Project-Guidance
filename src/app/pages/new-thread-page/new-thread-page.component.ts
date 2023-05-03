import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';

import { AuthService } from 'src/app/services/auth/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-thread-page',
  templateUrl: './new-thread-page.component.html',
  styleUrls: ['./new-thread-page.component.scss']
})
export class NewThreadPageComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public threadCtrl = new FormControl('');
  public filteredMembers: Observable<User[]> = of([]);
  public members: User[] = [];
  public contacts: User[] = [];

  public currentUser: User | null = null;

  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {

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
      console.error('Error getting contacts:', error);
    }

    //this.filteredMembers = this.threadCtrl.valueChanges.pipe(startWith(null),map(_member: User | null,_i)=>{return this._filter(_member)});


    this.filteredMembers = this.threadCtrl.valueChanges.pipe(
      startWith(''),
      map((memberName: string | null) => (memberName ? this._filter(memberName) : this.contacts.slice())),
    );
  } // End of ngOnInit()

  // Add a contact to the list of members
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const member = this.contacts.find(contact => contact.name === value);
      if (member) {
        this.members.push(member);
      }
    }

    event.chipInput!.clear();

    this.threadCtrl.setValue(null);
    
  }

  remove(member: User): void {
    const index = this.members.indexOf(member);

    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedUserName = event.option.value as string;
    const selectedUser = this.contacts.find(user => user.name === selectedUserName);
  
    if (selectedUser && !this.members.some(member => member.id === selectedUser.id)) {
      this.members.push(selectedUser);
      this.memberInput.nativeElement.value = '';
      this.threadCtrl.setValue(null);
    }
  }
  

  private _filter(memberName: string): User[] {
    // console.log('Filtering with memberName:', memberName);  // Log the input
  
    const filterValue = memberName.toLowerCase();
  
    const filteredMembers = this.contacts.filter(member => member.name.toLowerCase().includes(filterValue));
    
    // for (let index = 0; index < filteredMembers.length; index++) {
    //   console.log('Filtered members:', filteredMembers[index].name);  // Log the output
    // }
  
    return filteredMembers;
  }
  
}
