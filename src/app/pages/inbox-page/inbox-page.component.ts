import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { AuthService } from '../../services/auth/auth.service';
import { Thread } from '../../models/thread.model';

import { User } from '../../models/user.model';
import { count } from 'rxjs';

@Component({
  selector: 'app-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss']
})
export class InboxPageComponent implements OnInit {
  threads: Thread[] = [];
  public isLoading = false;
  public currentUser: User | null = null;
  public unreadCount: number = 0;
  unreadCounts: Promise<number>[] = [];
  


  constructor(private messageService: MessageService, private authService: AuthService) {}


  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.currentUser = await this.authService.getCurrentUser();
  
    if (this.currentUser) {
      // Get the threads for the current user
      this.threads = await this.messageService.getThreadsForUser(this.currentUser.id);

      this.updateUnreadCounts();


      // for(let i = 0; i < this.threads.length; i++) {
      //   const unreadCount = await this.messageService.getUnreadMessageCountForThread(this.threads[i].id, this.currentUser.id);

      //   // Log the unread count (for testing purposes)
      //   console.log('Thread:', this.threads[i].id, ' Unread:', unreadCount);
      // }


      // Set the loading state to false
      this.isLoading = false;
    }

     // Check for unread messages

  }

  updateUnreadCounts() {
    if (!this.currentUser) {
      console.log('Error: currentUser is null');
      return;
    }
    this.unreadCounts = this.threads.map(thread => this.messageService.getUnreadMessageCountForThread(thread.id, this.currentUser!.id));
    
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
