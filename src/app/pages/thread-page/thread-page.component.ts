import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message/message.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page.component.html',
  styleUrls: ['./thread-page.component.scss']
})
export class ThreadPageComponent implements OnInit {

  public threadId: string = '';
  public thread: Thread | null = null;
  public messages: Message[] = [];
  public messageForm: FormGroup = this.fb.group({
    content: ['', Validators.required]
  })

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    this.threadId = this.route.snapshot.paramMap.get('id')!;
    console.log('threadId:', this.threadId); 

    this.thread = await this.messageService.getThread(this.threadId);
    this.messages = await this.messageService.getMessagesForThread(this.threadId);
  
    //console.log('Thread:', this.thread);
    //console.log('Messages:', this.messages);
    // this.messageForm = this.fb.group({
    //   content: ['', Validators.required]
    // });
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      //const messageContent = this.messageForm?.get('content').value;
      // Your logic to send the message
      //console.log('Sending message:', messageContent);

      console.log('Sending message:', this.messageForm.value);
  
      // Reset the form
      this.messageForm.reset();
    }
  }
  
}
