import { Component } from '@angular/core';

@Component({
  selector: 'app-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss']
})
export class InboxPageComponent {
  // Dummy data for messages, replace it with your actual data source
  messages = [
    { title: 'Message 1', content: 'This is the content of Message 1' },
    { title: 'Message 2', content: 'This is the content of Message 2' },
    { title: 'Message 3', content: 'This is the content of Message 3' },
  ];

  constructor() {}

  createNewMessage(): void {
    // Your logic for creating a new message, e.g., navigate to a new message form
    console.log('Creating a new message');
  }
}
