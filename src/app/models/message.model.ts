export interface Message {
    id?: string;
    content: string;
    senderId: string;
    recipientId?: string;
    threadId: string;
    timestamp?: Date;
  }