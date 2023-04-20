// src/app/services/user/user.service.ts
import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private db = getFirestore();

  constructor() { }

  // Create a new user in Firestore
  public async createUser(uid: string, data: { name: string }): Promise<void> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      await setDoc(userDocRef, data);
    } catch (error) {
      console.error('Error adding user data to Firestore:', error);
      throw error;
    }
  }

  // Get a user from Firestore by uid
  public async getUser(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return new User(uid, userData['name'], userData['email']);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
      throw error;
    }
  }

  getUsers(): Observable<User[]> {
    const userCollectionQuery = query(collection(this.db, 'users'));

    return from(
      getDocs(userCollectionQuery).then((querySnapshot) => {
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const user = new User(doc.id, userData['name'], userData['email']);
          users.push(user);
        });
        return users;
      })
    );
  } // End of getUsers()


}
