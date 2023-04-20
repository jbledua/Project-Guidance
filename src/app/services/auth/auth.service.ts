import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword , User, signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth functions and User type
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(); // Initialize Firebase Authentication
  private authState = new BehaviorSubject<boolean>(false);
  public authState$ = this.authState.asObservable();

  private db = getFirestore();

  // Constructor
  constructor(private userService: UserService) {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        this.authState.next(true);
      } else {
        // User is signed out
        this.authState.next(false);
      }
    });
  } // End of constructor

  // Login with email and password
  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        // Handle error
        console.error('Error during login:', error);
        throw error;
      });
  }

  // Logout
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.error('Error during logout:', error);
        throw error;
      });
  } // End of logout()

  // Check if user is logged in
  public get isAuthenticated(): boolean {
    return this.authState.value;
  } // End of isAuthenticated()

  // Create a new user with email and password
  public createUser(email: string, password: string, name: string): Promise<User> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Add user's data to Firestore
        //this.addUserDataToFirestore(user.uid, { name });
        this.userService.createUser(user.uid, { name });
        
        return user;
      })
      .catch((error) => {
        // Handle error
        console.error('Error during user creation:', error);
        throw error;
      });

  } // End of createUser()
}
