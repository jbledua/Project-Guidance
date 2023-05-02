import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Create a Firestore reference
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
  } // End of createUser()

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
  } // End of getUser()

  public async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(this.db, 'users');
      const usersSnapshot = await getDocs(usersRef);
  
      const users: User[] = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        const user: User = {
          id: doc.id,
          name: data['name'],
          email: data['email'],
          // Add other fields as necessary
        };
        users.push(user);
      });
  
      return users;
    } catch (error) {
      console.error("Error getting all users: ", error);
      throw error;
    }
  } // End of getAllUsers()

  // Get contacts for a user
  public async getContacts(uid: string): Promise<string[]> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      const userSnapshot = await getDoc(userDocRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const contacts = userData['contacts'] || [];
        return contacts;
      } else {
        console.error(`User with ID ${uid} does not exist.`);
        return [];
      }
    } catch (error) {
      console.error('Error getting contacts for user:', error);
      throw error;
    }
  } // End of getContacts()
  

  // Get contacts for a user
  
}
