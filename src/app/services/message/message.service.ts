import { Injectable } from '@angular/core';

import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  addDoc, 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  orderBy, 
  limit ,
  onSnapshot, 
  arrayUnion,
  updateDoc
} from 'firebase/firestore';

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

  //----------------------------------------------------------------------------------
  // THREAD METHODS
  //----------------------------------------------------------------------------------

   // Get threads for a specific user
   public async getThreadsForUser(uid: string): Promise<Thread[]> {
    try {
      const threadsRef = collection(this.db, 'threads');
      const threadsQuery = query(threadsRef, where('members', 'array-contains', uid));
      const threadSnapshot = await getDocs(threadsQuery);
  
      const threads: Thread[] = [];
      for (const doc of threadSnapshot.docs) {
        const threadData = doc.data();

        // Get the lastMessage object from the thread document
      const lastMessage = threadData['lastMessage'] ? {
        content: threadData['lastMessage']['content'],
        timestamp: threadData['lastMessage']['timestamp'].toDate()
      } : null;

        threads.push({
          id: doc.id,
          subject: threadData['subject'],
          members: threadData['members'],
          createdAt: threadData['createdAt'].toDate(),
          lastMessage: lastMessage,
        });
      }
  
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

        if (threadData) {
          // Get the lastMessage object from the thread document
          const lastMessage = threadData['lastMessage'] ? {
            content: threadData['lastMessage']['content'],
            timestamp: threadData['lastMessage']['timestamp'].toDate()
          } : null;

          // Convert the Firestore Timestamp to a Date object
          const createdAt = threadData['createdAt'].toDate();
          
          return { 
            id: threadSnapshot.id, 
            subject: threadData['subject'], 
            members: threadData['members'], 
            createdAt,
            lastMessage: lastMessage
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting thread:', error);
      throw error;
    }
  } // End of getThread()


  // Listen for new threads for a specific user
  public listenForNewThreads(uid: string, callback: (threads: Thread[]) => void): () => void {
    const threadsRef = collection(this.db, 'threads');
    const threadsQuery = query(
      threadsRef,
      where('members', 'array-contains', uid)
    );
  
    return onSnapshot(threadsQuery, async (snapshot) => {
      const threads: Thread[] = [];
      const promises = snapshot.docs.map(async (doc) => {
        const threadData = doc.data();
  
        // Get the lastMessage object from the thread document
        const lastMessage = threadData['lastMessage'] ? {
          content: threadData['lastMessage']['content'],
          timestamp: threadData['lastMessage']['timestamp'].toDate()
        } : null;

  
        const thread: Thread = {
          id: doc.id,
          subject: threadData['subject'],
          members: threadData['members'],
          createdAt: threadData['createdAt'].toDate(),
          lastMessage: lastMessage,
        };
        threads.push(thread);
      });
  
      await Promise.all(promises);
      callback(threads);
    });
  } // End of listenForNewThreads()


  // Create a new thread with a given subject and array of members
  public async createThread(subject: string, members: User[]): Promise<string> {
    try {
      // Convert members array to an array of member IDs
      const memberIds = members.map(member => member.id);

      // Add a new document with a generated ID
      const newThreadRef = await addDoc(collection(this.db, 'threads'), {
        subject,
        memberIds,
        createdAt: serverTimestamp()
      });
      console.log("New thread created with ID: ", newThreadRef.id);
      return newThreadRef.id;  // Return the new thread's ID
    } catch (error) {
      console.error("Error creating thread: ", error);
      throw error;
    }
} // End of createThread()

  
  // // Create a new thread
  // public async createThread(thread: Omit<Thread, 'id'>): Promise<string> {
  //   try {
  //     // Add a new document with a generated ID
  //     const newThreadRef = await addDoc(collection(this.db, 'threads'), {
  //       ...thread,
  //       createdAt: serverTimestamp()
  //     });
  //     console.log("New thread created with ID: ", newThreadRef.id);
  //     return newThreadRef.id;
  //   } catch (error) {
  //     console.error("Error creating thread: ", error);
  //     throw error;
  //   }
  // } // End of createThread()

  // Add user to a specific thread
  public async addUserToThread(threadId: string, userId: string): Promise<void> {
    try {
      const threadRef = doc(this.db, 'threads', threadId);
  
      // Add the user's UID to the 'members' array
      await updateDoc(threadRef, {
        members: arrayUnion(userId)
      });
    } catch (error) {
      console.error('Error adding user to thread:', error);
      throw error;
    }
  } // End of addUserToThread()

  //----------------------------------------------------------------------------------
  // MESSAGE METHODS
  //----------------------------------------------------------------------------------

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

      const messages: Message[] = [];
      messagesSnapshot.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          content: data['content'],
          senderId: data['senderId'],
          senderName: data['senderName'], // Add this line
          recipientId: data['recipientId'],
          threadId: data['threadId'],
          timestamp: data['timestamp'].toDate(),
          read: data['read'] || {},
        };
        messages.push(message);
      });

      return messages;
    } catch (error) {
      console.error('Error getting messages for thread:', error);
      throw error;
    }
  } // End of getMessagesForThread()

  // Add a new message to a specific thread
  public async addMessageToThread(message: Message): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Add a new document with a generated ID
        const newMessageRef = await addDoc(collection(this.db, 'messages'), {
          content: message.content,
          senderId: message.senderId,
          senderName: message.senderName,
          threadId: message.threadId,
          timestamp: serverTimestamp(),
          read: [message.senderId]
        });

        // Get the thread document reference
        const threadRef = doc(this.db, 'threads', message.threadId);

        // Update the thread document with the last message content and timestamp
        await updateDoc(threadRef, {
          lastMessage: {
            content: message.content,
            timestamp: serverTimestamp()
          }
        });
        console.log("Thread document updated with last message");

      } else {
        throw new Error("No user is signed in");
      }
    } catch (error) {
      console.error("Error adding message: ", error);
      throw error;
    }
  } // End of addMessageToThread()


  // Listen for new messages in a specific thread
  public listenForNewMessages(threadId: string, callback: (messages: Message[]) => void): () => void {
    const messagesRef = collection(this.db, 'messages');
    const messagesQuery = query(
      messagesRef,
      where('threadId', '==', threadId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(messagesQuery, async (snapshot) => {
      const messages: Message[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          content: data['content'],
          senderId: data['senderId'],
          senderName: data['senderName'], // Add this line
          recipientId: data['recipientId'],
          threadId: data['threadId'],
          timestamp: data['timestamp'].toDate(),
          read: data['read'] || {}
        };
        messages.push(message);
      });
      callback(messages);
    });
  } // End of listenForNewMessages()
  
  // Mark a specific message as read
  public async markMessageAsRead(message: Message, uid: string): Promise<void> {
    try {
      const messageRef = doc(this.db, `messages/${message.id}`);
  
      // Add the user's UID to the 'read' array
      await updateDoc(messageRef, {
        read: arrayUnion(uid)
      });

    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  } // End of markMessageAsRead()
  
  // Get the number of unread messages for a specific thread
  public async getUnreadMessageCountForThread(threadId: string, uid: string): Promise<number> {
    try {
      const messagesRef = collection(this.db, 'messages');
  
      // Query for all messages in the thread
      const messagesQuery = query(
        messagesRef,
        where('threadId', '==', threadId)
      );
  
      const messagesSnapshot = await getDocs(messagesQuery);
  
      let unreadCount = 0;
  
      // Count the messages where 'read' does not contain the user's UID
      messagesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data['read']) && !data['read'].includes(uid)) { // Check if 'read' is an array
          unreadCount++;
        }
      });
  
      // Return the number of unread messages
      return unreadCount;
    } catch (error) {
      console.error('Error getting unread message count for thread:', error);
      throw error;
    }
  } // End of getUnreadMessageCountForThread()

  //---------------------------------------------------------------------------------
  // INTERNAL/HELPER METHODS
  //---------------------------------------------------------------------------------
  
  // Get the last message for a specific thread
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
          senderName: data['senderName'], // Add this line
          recipientId: data['recipientId'],
          threadId: data['threadId'],
          timestamp: data['timestamp'].toDate(),
          read: data['read'] || {},
        };
        return message;
      }
      return null;
    } catch (error) {
      console.error('Error getting last message for thread:', error);
      throw error;
    }
  } // End of getLastMessageForThread()
  
  
}
