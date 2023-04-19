import { Injectable } from '@angular/core';
import { addDoc, collection, serverTimestamp, getFirestore  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../../models/message.model';
import { Thread } from '../../models/thread.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: AngularFirestore) { }

  // Function to store a message in Firestore
  async storeMessage(threadId: string, message: Message): Promise<void> {
    try {
      // Add the message to the messages collection with the specified threadId
      await this.firestore.collection('messages').add({
        threadId: threadId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.timestamp,
      });
    } catch (error) {
      console.error('Error storing message:', error);
      throw error;
    }
  }

  // Function to create a new thread in Firestore
  public async createThread(members: string[], subject?: string): Promise<string> {
    const db = getFirestore();
    const auth = getAuth();
  
    // If the subject is not provided, concatenate member names as the subject.
    if (!subject) {
      subject = members.join(', ');
    }
  
    // Create a new thread object
    const newThread = {
      subject: subject,
      members: members,
      createdAt: serverTimestamp(),
    };
  
    try {
      // Add the new thread to the 'threads' collection
      const docRef = await addDoc(collection(db, 'threads'), newThread);
      return docRef.id; // Return the new thread ID
    } catch (error) {
      console.error('Error creating the thread:', error);
      throw error;
    }
  }
}
