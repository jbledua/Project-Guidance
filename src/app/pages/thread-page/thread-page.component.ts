import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from 'src/app/models/thread.model';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page.component.html',
  styleUrls: ['./thread-page.component.scss']
})
export class ThreadPageComponent implements OnInit {
  thread: Thread | null = null;
  messages: Message[] = [];

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const threadId = this.route.snapshot.paramMap.get('id');
    if (threadId) {
      //this.thread = await this.messageService.getThread(threadId);
      //this.messages = await this.messageService.getMessagesForThread(threadId);
    }
  }
}
