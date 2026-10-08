import { inject, Injectable } from '@angular/core';
import { Firestore , collection, onSnapshot , addDoc, updateDoc, doc, deleteDoc, query, where, setDoc } from '@angular/fire/firestore';
import { ITask } from '../interface/ITask';
import { Observable, of, switchMap } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FocusSerService {

  private _Firestore = inject(Firestore)
  private Auth  = inject(Auth)
  CollectionName = "FocusTask"
constructor() {}



async createItem(data:ITask):Promise<string>{
  const itemDoc  = collection(this._Firestore,this.CollectionName)
  const itemRef = await addDoc(itemDoc , data)
  return itemRef.id
}


getItem(): Observable<ITask[]> {
  return authState(this.Auth).pipe(
    switchMap((user) => {
      if (!user) {
        return of([]);
      }

      return new Observable<ITask[]>((observer) => {
        const colRef = collection(this._Firestore, this.CollectionName);
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


async updateItem(firebaseId:string , data: Partial<ITask>):Promise<any>{
  const itemDoc = doc(this._Firestore ,`${this.CollectionName}/${firebaseId}`)
  return updateDoc(itemDoc , {...data} )
}



async deleteItem(firebaseId:string):Promise<any>{
  const itemDoc = doc(this._Firestore,`${this.CollectionName}/${firebaseId}`)
  return deleteDoc(itemDoc)
}












}
