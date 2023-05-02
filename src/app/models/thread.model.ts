export interface Thread {
  id: string;
  subject: string;
  members: string[];
  createdAt: Date;
  lastMessage: {
    content: string;
    timestamp: Date;
  } | null;
}
