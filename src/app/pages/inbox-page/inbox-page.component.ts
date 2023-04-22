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

  constructor(private messageService: MessageService, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    const currentUser = await this.authService.getCurrentUser();

    //console.log('Current user ID:', currentUser?.id);
    if (currentUser) {
      this.threads = await this.messageService.getThreadsForUser(currentUser.id);
      //console.log('Threads:', this.threads);
    }
  }

  createNewMessage(): void {
    // Your logic for creating a new message, e.g., navigate to a new message form
    console.log('Creating a new message');
  }
}
