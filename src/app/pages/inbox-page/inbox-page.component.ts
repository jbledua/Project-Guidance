import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { AuthService } from '../../services/auth/auth.service';
import { Thread } from '../../models/thread.model';

import { User } from '../../models/user.model';
import { count } from 'rxjs';

import { MatMenu } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';



@Component({
  selector: 'app-inbox-page',
  templateUrl: './inbox-page.component.html',
  styleUrls: ['./inbox-page.component.scss']
})
export class InboxPageComponent implements OnInit {
  public threads: Thread[] = [];
  public isLoading = false;
  public currentUser: User | null = null;
  public unreadCount: number = 0;
  public unreadCounts: Promise<number>[] = [];
  public unreadCountsNumber: number[] = [];

  private unsubscribeFromNewThreads: (() => void) | null = null;



  constructor(private messageService: MessageService, private authService: AuthService) {}


  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.currentUser = await this.authService.getCurrentUser();
  
    if (this.currentUser) {
      // Get the threads for the current user
      this.threads = await this.messageService.getThreadsForUser(this.currentUser.id);

      // Update the unread counts
      this.updateUnreadCounts();

      // Listen for new threads
      this.unsubscribeFromNewThreads = this.messageService.listenForNewThreads(this.currentUser.id, (newThreads) => {
        this.threads = newThreads;

        // Update the unread counts
        this.updateUnreadCounts();
      });

      // Set the loading state to false
      this.isLoading = false;
    }

  }

  async updateUnreadCounts() {
    if (!this.currentUser) {
      console.log('Error: currentUser is null');
      return;
    }
  
    this.unreadCounts = this.threads.map(thread => 
      this.messageService.getUnreadMessageCountForThread(thread.id, this.currentUser!.id)
    );
  
    // Use Promise.all to wait for all promises to resolve
    this.unreadCountsNumber = await Promise.all(this.unreadCounts);
  }
  

  // This method is used to create a new message
  public createNewMessage(): void {
    // Your logic for creating a new message, e.g., navigate to a new message form
    console.log('Creating a new message');
  }

  // This method is used to shorten the message content to a maximum length
  public shortenMessage(message: string, maxLength: number): string {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength -  3) + '...';
  }

  ngOnDestroy(): void {
    if (this.unsubscribeFromNewThreads) {
      this.unsubscribeFromNewThreads();
    }
  }
  //@ViewChild('contextMenu') contextMenu?: MatMenuTrigger;

  @ViewChild(MatMenuTrigger) contextMenuTrigger?: MatMenuTrigger;
  
  openContextMenu(event: MouseEvent, thread: any) {
    
    event.preventDefault();
    console.log('Opening context menu');

    if (this.contextMenuTrigger) {
      this.contextMenuTrigger.openMenu();
    }
    
  }

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, thread: Thread) {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    if(thread)
    {
      this.contextMenu.menuData = { 'thread': thread };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }

  }

  blockDefault(event: MouseEvent) {
    event.preventDefault();
  }

  removeThread(thread: Thread) {
    console.log('Removing thread');
  }

  deleteThread(thread: Thread) {
    console.log('Deleting thread');
  }
  
}
