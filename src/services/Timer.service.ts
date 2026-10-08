import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

    private _Firestore = inject(Firestore)
  private Auth  = inject(Auth)
constructor() { }




getTimerSnapshot(): Observable<number | null> {
    return new Observable((observer) => {
      const timeDoc = doc(this._Firestore, 'timer/currentTimer');

      const unsubscribe = onSnapshot(timeDoc, (snapshot) => {
        if (snapshot.exists()) {
          observer.next(snapshot.data()['endTime']);
        } else {
          observer.next(null);
        }
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  async updateTimer(endTime: number): Promise<void> {
    const timeDoc = doc(this._Firestore, 'timer/currentTimer');
    await setDoc(timeDoc, { endTime });
  }






}
