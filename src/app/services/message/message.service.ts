import { Injectable } from '@angular/core';
import { getFirestore, addDoc, collection, serverTimestamp, query, where, getDocs, doc, getDoc, orderBy, limit  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Message } from '../../models/message.model';
import { Thread } from '../../models/thread.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // Create a Firestore reference
  private db = getFirestore();

  constructor() { }

  // Get threads for a specific user
  public async getThreadsForUser(uid: string): Promise<Thread[]> {
    try {
      const threadsRef = collection(this.db, 'threads');
      const threadsQuery = query(threadsRef, where('members', 'array-contains', uid));
      const threadSnapshot = await getDocs(threadsQuery);
      const _lastMessage = "";
      
  
      const threads: Thread[] = [];
      threadSnapshot.forEach((doc) => {
        const data = doc.data();
        //const _lastMessage = await this.getLastMessageForThread(doc.id)?.content;
       

        threads.push({
          id: doc.id,
          subject: data['subject'],
          members: data['members'],
          createdAt: data['createdAt'].toDate(),
          lastMessage: _lastMessage,
        });
      });
  
      return threads;
    } catch (error) {
      console.error('Error getting threads for user:', error);
      throw error;
    }
  } // End of getThreadsForUser()

  // Get a specific thread by ID
  public async getThread(threadId: string): Promise<Thread | null> {
    try {
      const threadDocRef = doc(this.db, 'threads', threadId);
      const threadSnapshot = await getDoc(threadDocRef);
      if (threadSnapshot.exists()) {
        const threadData = threadSnapshot.data();

        const lastMessage = await this.getLastMessageForThread(threadId);

        if (threadData) {

          // Convert the Firestore Timestamp to a Date object
          const createdAt = threadData['createdAt'].toDate();
          
          return { 
            id: threadSnapshot.id, 
            subject: threadData['subject'], 
            members: threadData['members'], 
            createdAt,
            lastMessage: lastMessage?.content || ""
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting thread:', error);
      throw error;
    }
  } // End of getThread()

  public async getLastMessageForThread(threadId: string): Promise<Message | null> {
    try {
      const messagesRef = collection(this.db, 'messages');
  
      const messagesQuery = query(
        messagesRef,
        where('threadId', '==', threadId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
  
      const messagesSnapshot = await getDocs(messagesQuery);
  
      if (!messagesSnapshot.empty) {
        const doc = messagesSnapshot.docs[0];
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          content: data['content'],
          senderId: data['senderId'],
          recipientId: data['recipientId'],
          threadId: data['threadId'],
          timestamp: data['timestamp'].toDate(),
        };
        return message;
      }
      return null;
    } catch (error) {
      console.error('Error getting last message for thread:', error);
      throw error;
    }
  }
  


  // Get messages for a specific thread
  public async getMessagesForThread(threadId: string): Promise<Message[]> {
    try {
      const messagesRef = collection(this.db, 'messages');

      const messagesQuery = query(
        messagesRef,
        where('threadId', '==', threadId),
        orderBy('timestamp', 'asc')
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      console.log('querySnapshot:', messagesSnapshot); // Add this line

      const messages: Message[] = [];
      messagesSnapshot.forEach((doc) => {
        console.log('doc:', doc); // Add this line
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          content: data['content'],
          senderId: data['senderId'],
          recipientId: data['recipientId'],
          threadId: data['threadId'],
          timestamp: data['timestamp'].toDate(),
        };
        messages.push(message);
      });

      console.log('messages:', messages); // Add this line

      return messages;
    } catch (error) {
      console.error('Error getting messages for thread:', error);
      throw error;
    }
  } // End of getMessagesForThread()




}
