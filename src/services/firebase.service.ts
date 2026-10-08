import { Auth } from '@angular/fire/auth';
import { Item } from './../../node_modules/@firebase/analytics-types/index.d';
import { Injectable, inject } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, updateDoc, onSnapshot , deleteDoc, query, where } from '@angular/fire/firestore';
import { ITask } from '../interface/ITask';
import { Observable, of, switchMap } from 'rxjs';
import { authState } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _Firestore = inject(Firestore )
  private NameOfData = "Tasks";
  private Auth = inject(Auth)
  constructor() {}


  async CreatItem(data: ITask): Promise<string> {
    const itemCollection = collection(this._Firestore, this.NameOfData);
    const docRef = await addDoc(itemCollection, data);
    return docRef.id;
  }


getItem(): Observable<ITask[]> {
  return authState(this.Auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of([]);
      }

      return new Observable<ITask[]>((observer) => {
        const colRef = collection(this._Firestore, this.NameOfData);
        const q = query(colRef, where('UID', '==', user.uid));

        const item = onSnapshot(
          q,
          (snapshot) => {
            const items = snapshot.docs.map((d) => ({
              ...(d.data() as ITask),
              firebaseId: d.id,
              UID:user.uid
            }));
            observer.next(items);
          },
          (error) => {
            observer.error(error);
          }
        );

        return () => item();
      });
    })
  );
}

  async UpdateItem(firebaseId: string, data: Partial<ITask>): Promise<void> {
    const itemDoc = doc(this._Firestore, `${this.NameOfData}/${firebaseId}`);
    return updateDoc(itemDoc, { ...data });
  }


  async deletItem(firebaseId:string): Promise<void>{
      const itemDoc = doc(this._Firestore, `${this.NameOfData}/${firebaseId}`);
          return deleteDoc(itemDoc);
  }

}



