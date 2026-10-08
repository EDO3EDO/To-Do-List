import { Injectable, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { ITask } from '../interface/ITask';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalSerService {
  private _firestroe = inject(Firestore);
  private auth = inject(Auth);
  collectName = "personal";

  constructor() { }

  async CreatItem(data: ITask): Promise<string> {
    const user = this.auth.currentUser;
    const itemDoc = collection(this._firestroe, this.collectName);
    const taskWithUid = {
      ...data,
      UID: user ? user.uid : ""
    };
    const docRef = await addDoc(itemDoc, taskWithUid);
    return docRef.id;
  }

  getItem(): Observable<ITask[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        return new Observable<ITask[]>((observe) => {
          const ItemDoc = collection(this._firestroe, this.collectName);
          const q = query(ItemDoc, where('UID', '==', user.uid));

          const personal = onSnapshot(
            q,
            (item) => {
              const task = item.docs.map(t => ({
                ...(t.data() as ITask),
                firebaseId: t.id,
                UID: user.uid
              }));
              observe.next(task);
            },
            (error) => {
              console.log(error);
              observe.error(error);
            }
          );

          return () => personal();
        });
      })
    );
  }

  async UpdateItem(firebaseId: string, data: ITask): Promise<any> {
    const itemDoc = doc(this._firestroe, `${this.collectName}/${firebaseId}`);
    return updateDoc(itemDoc, { ...data });
  }

  async deleteItem(firebaseId: string) {
    const itemDoc = doc(this._firestroe, `${this.collectName}/${firebaseId}`);
    return deleteDoc(itemDoc);
  }
}
