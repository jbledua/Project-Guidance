export interface Message {
    id?: string;
    content: string;
    senderName?: string;
    senderId: string;
    recipientId?: string;
    threadId: string;
    timestamp?: Date;
    read: string[];
  }