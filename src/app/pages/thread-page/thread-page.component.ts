import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message/message.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page.component.html',
  styleUrls: ['./thread-page.component.scss']
})
export class ThreadPageComponent implements OnInit {

  public isLoading = false;
  public threadId: string = '';
  public thread: Thread | null = null;
  public messages: Message[] = [];
  public messageForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  })

  public messageClasses: string[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  async isReceivedMessage(message: Message): Promise<boolean> {
    const currentUser = await this.authService.getCurrentUser();
    return message.senderId !== currentUser?.id;
  }

  async loadMessages(): Promise<void> {
    this.messages = await this.messageService.getMessagesForThread(this.threadId);
    for (const message of this.messages) {
      const isReceived = await this.isReceivedMessage(message);
      this.messageClasses.push(isReceived ? 'received' : 'sent');
    }
  }
  
  

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.threadId = this.route.snapshot.paramMap.get('id')!;
    console.log('threadId:', this.threadId); 

    this.thread = await this.messageService.getThread(this.threadId);
    this.messages = await this.messageService.getMessagesForThread(this.threadId);
  
    this.isLoading = false;

  }

  sendMessage(): void {
    if (this.messageForm.valid) {

      console.log('Sending message:', this.messageForm.value);
  
      // Reset the form
      this.messageForm.reset();
    }
  }
  
}
