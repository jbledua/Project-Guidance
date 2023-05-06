import { Component, OnInit , OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';

import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message/message.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';

import { ViewChild, ElementRef } from '@angular/core';



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

  public currentUser: User | null = null;
  public unreadCount: number = 0;
  public hideScrollFab: boolean = false;


  private unsubscribeFromNewMessages?: () => void;

  @ViewChild('bottom', { read: ElementRef }) private bottom!: ElementRef;

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


    // Mark all messages as read
    for (let message of this.messages) {
      if (!message.read?.includes(this.currentUser?.id || '')) {
          await this.messageService.markMessageAsRead(message, this.currentUser?.id || '');
      }
    }
  }

  // Initialize the component
  async ngOnInit(): Promise<void> {

    // Set a flag to indicate loading
    this.isLoading = true;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const offsetHeight = window.innerHeight;
      const bottomPosition = scrollHeight - offsetHeight;
  
      this.hideScrollFab = scrollTop >= bottomPosition;
    });


    // Get the thread ID from the route
    this.threadId = this.route.snapshot.paramMap.get('id')!;


    // Get the current user
    const currentAuthUser = await this.authService.getCurrentUser();
    
    if (!currentAuthUser) {
      console.error('No current user');
      return;
    }

    this.currentUser = await this.userService.getUser(currentAuthUser.id)


    // Intial the thread and messages
    this.loadMessages();
  
   

    // Display the messages (for testing purposes)
    //console.log('messages:', this.messages);

    this.unsubscribeFromNewMessages = this.messageService.listenForNewMessages(this.threadId, (messages) => {
      this.messages = messages;
    });

     // Set a flag to indicate loading is complete
     this.isLoading = false;

  }

  // Check if this message was sent by the current user
  public isMessageFromCurrentUser(message: Message): boolean {
    
    //console.log('message:', message.id, " is ", (message.senderId === this.currentUser?.id)? "from current user" : "not from current user");
    
    return message.senderId === this.currentUser?.id;
  }


  

  async sendMessage(): Promise<void> {
    if (this.messageForm.valid) {
  
      console.log('Sending message:', this.messageForm.value);
  
      const currentUser = await this.authService.getCurrentUser();
  
      if (!currentUser) {
        console.error('No current user');
        return;
      }
  
      const userDetails: User | null = await this.userService.getUser(currentUser.id);
  
      if (!userDetails) {
        console.error('No user details found');
        return;
      }
  
      const message: Message = {
        content: this.messageForm.value.content,
        senderId: currentUser.id,
        senderName: userDetails.name,
        threadId: this.threadId,
        read:  [currentUser.id] 
        // recipientId is not needed in this function, but it may be necessary elsewhere in your code
      };
  
      try {
        await this.messageService.addMessageToThread(message);
        this.messageForm.reset();
        this.loadMessages(); // Reload messages after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
      
    }
  } // End of sendMessage()

  

  scrollToBottom(): void {
    this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  

  ngOnDestroy(): void {
    if (this.unsubscribeFromNewMessages) {
      this.unsubscribeFromNewMessages();
    }
  }

}
