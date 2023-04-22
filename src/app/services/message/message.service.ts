import { Injectable } from '@angular/core';
import { getFirestore, addDoc, collection, serverTimestamp, query, where, getDocs  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Message } from '../../models/message.model';
import { Thread } from '../../models/thread.model';

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
  
      const threads: Thread[] = [];
      threadSnapshot.forEach((doc) => {
        const data = doc.data();
        threads.push({
          id: doc.id,
          subject: data['subject'],
          members: data['members'],
          createdAt: data['createdAt'].toDate(),
        });
      });
  
      return threads;
    } catch (error) {
      console.error('Error getting threads for user:', error);
      throw error;
    }
  }

}
