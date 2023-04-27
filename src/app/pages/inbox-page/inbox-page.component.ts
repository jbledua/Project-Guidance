import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { AuthService } from '../../services/auth/auth.service';
import { Thread } from '../../models/thread.model';

@Component({
  selector: 'app-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss']
})
export class InboxPageComponent implements OnInit {
  threads: Thread[] = [];
  public isLoading = false;

  constructor(private messageService: MessageService, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const currentUser = await this.authService.getCurrentUser();
  
    if (currentUser) {
      // Get the threads for the current user
      this.threads = await this.messageService.getThreadsForUser(currentUser.id);

      // Set the loading state to false
      this.isLoading = false;
    }
  }

  // This method is used to create a new message
  createNewMessage(): void {
    // Your logic for creating a new message, e.g., navigate to a new message form
    console.log('Creating a new message');
  }

  // This method is used to shorten the message content to a maximum length
  shortenMessage(message: string, maxLength: number): string {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength -  3) + '...';
  }
}
