import { Component, OnInit , OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';

import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message/message.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page.component.html',
  styleUrls: ['./thread-page.component.scss']
})
export class ThreadPageComponent implements OnInit, OnDestroy  {

  public isLoading = false;
  public threadId: string = '';
  public thread: Thread | null = null;
  public messages: Message[] = [];
  public messageForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  });

  private unsubscribeFromNewMessages?: () => void;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  // Update the thread and messages
  async loadMessages(): Promise<void> {
    // Get the thread and messages
    this.thread = await this.messageService.getThread(this.threadId);
    this.messages = await this.messageService.getMessagesForThread(this.threadId);
  }

  // Initialize the component
  async ngOnInit(): Promise<void> {

    // Set a flag to indicate loading
    this.isLoading = true;

    // Get the thread ID from the route
    this.threadId = this.route.snapshot.paramMap.get('id')!;

    // Display the thread ID (for testing purposes)
    //console.log('threadId:', this.threadId); 

    // Get the thread and messages
    this.thread = await this.messageService.getThread(this.threadId);
    this.messages = await this.messageService.getMessagesForThread(this.threadId);
  
    // Set a flag to indicate loading is complete
    this.isLoading = false;

    // Display the messages (for testing purposes)
    //console.log('messages:', this.messages);

    this.unsubscribeFromNewMessages = this.messageService.listenForNewMessages(this.threadId, (messages) => {
      this.messages = messages;
    });

  }

  // Send a message
  async sendMessage(): Promise<void> {
    if (this.messageForm.valid) {

      console.log('Sending message:', this.messageForm.value);

      const currentUser = await this.authService.getCurrentUser();

      if (!currentUser) {
        console.error('No current user');
        return;
      }

      const message: Message = {
        content: this.messageForm.value.content,
        senderId: currentUser.id,
        threadId: this.threadId,
        // recipientId is not needed in this function, but it may be necessary elsewhere in your code
      };

      try {
        await this.messageService.addMessageToThread(message);
        console.log('Message sent successfully');
        this.messageForm.reset();
        this.loadMessages(); // Reload messages after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
      
    }
  } // End of sendMessage()

  ngOnDestroy(): void {
    if (this.unsubscribeFromNewMessages) {
      this.unsubscribeFromNewMessages();
    }
  }

}
