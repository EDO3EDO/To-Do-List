import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, user } from '@angular/fire/auth';
import { doc, docData, Firestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, map, Observable, of, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private Auth = inject(Auth)
  private firestore = inject(Firestore)
constructor(private _HttpClient:HttpClient , private _Router:Router) {
user(this.Auth).subscribe((u) => {
      if (u) {
        this.IsLogedIn.next(true);
      } else {
        this.IsLogedIn.next(false);
      }
    });
}

IsLogedIn = new BehaviorSubject<boolean>(false);





SignUp(email:string , password:string , name:string ){
  return from(createUserWithEmailAndPassword(this.Auth,email , password)).pipe(
    switchMap((save) => {
      const userDoc = doc(this.firestore , `users/${save.user.uid}`)
      return setDoc(userDoc , {
        uid:save.user.uid,
        email:email,
        bio:'',
        name:name,
        photoURL:"03.png",
      })
    })
  )
}





GoogelSignUp(){
  const proff = new GoogleAuthProvider();
  return from(signInWithPopup(this.Auth , proff)).pipe(
    switchMap((save) => {
      const userDoc = doc(this.firestore ,`users/${save.user.uid}`)
      const user = save.user;
      return setDoc(userDoc , {
        uid: user.uid,
          email: user.email,
          name:user.displayName,
          displayName: user.displayName,
          photoURL: user.photoURL,
          bio:'',
          lastLogin: new Date()
      },{ merge: true })
    })
  )
}



SignIn(email:string , password:string){
  return from(signInWithEmailAndPassword(this.Auth, email , password))
}

async SignOut(){
  await signOut(this.Auth)
  this._Router.navigate([('/Sign-In')])
}





/////////////////////////////////get Data User /////////////////



getUserPhoto(): Observable<string | null> {
    return user(this.Auth).pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return of(null);
        }
        return new Observable<string | null>((observer) => {
          const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
          const unsubscribe = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const userData = snap.data();
              observer.next(userData['photoURL'] || '03.png');
            } else {
              observer.next('03.png');
            }
          }, (error) => {
            observer.error(error);
          });
          return () => unsubscribe();
        });
      })
    );
  }


  getName():Observable<string | null>{
    return user(this.Auth).pipe(
      switchMap(currnt => {
        if(!currnt){
          return of(null)
        }
        return new Observable<string | null>((observ) => {
          const ItemRef = doc(this.firestore , `users/${currnt.uid}`)
          const user = onSnapshot(ItemRef , (snap) => {
            if(snap.exists()){
              const data  = snap.data();
              observ.next(data['name'] || data['Name'] || ' ')
            }
          }, (error) => {observ.error(error);}
        )
      return () => user();
      }
      )
    })
  )
}



getUserBio(): Observable<string | null> {
  return user(this.Auth).pipe(
    switchMap(currentUser => {
      if (!currentUser) return of(null);

      return new Observable<string | null>((observer) => {
        const docRef = doc(this.firestore, `users/${currentUser.uid}`);
        const unsubscribe = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const userData = snap.data();
            observer.next(userData['bio'] || '');
          } else {
            observer.next('');
          }
        }, (error) => observer.error(error));

        return () => unsubscribe();
      });
    })
  );
}

getUserEmail(): Observable<string | null> {
  return user(this.Auth).pipe(
    switchMap(currentUser => {
      if (!currentUser) return of(null);

      return new Observable<string | null>((observer) => {
        const docRef = doc(this.firestore, `users/${currentUser.uid}`);
        const unsubscribe = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const userData = snap.data();
            observer.next(userData['email'] || '');
          } else {
            observer.next('');
          }
        }, (error) => observer.error(error));
        return () => unsubscribe();
      });
    })
  );
}




async UpdateBio(text: string): Promise<any> {
  const data = this.Auth.currentUser;
  if (data) {
    const docRef = doc(this.firestore, `users/${data.uid}`);
    return setDoc(docRef, { bio: text }, { merge: true });
  } else {
    throw new Error("No authenticated user found");
  }
}


async UpdateUserName(newName: string): Promise<any> {
  const data = this.Auth.currentUser;
  if (data) {
    const ItemRef = doc(this.firestore, `users/${data.uid}`);
    return setDoc(ItemRef, { name: newName }, { merge: true });
  } else {
    throw new Error("No authenticated user found");
  }
}



async UpdatePhotoUser(newPhoto:string):Promise<any>{
  const data =  this.Auth.currentUser;
  if(data){
    const ItemRef = doc(this.firestore , `users/${data.uid}`)
    return updateDoc(ItemRef , {photoURL:newPhoto})
  }else{
    return new Error("No authenticated user found");
  }
}




}
