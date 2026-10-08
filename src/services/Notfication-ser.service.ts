import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NotficationSerService {

constructor() { }

private auth = inject(Auth)


  switchNot = signal<boolean>(false)

switchfun() {
  this.switchNot.update(Notfiy => !Notfiy);

  const uid = this.auth.currentUser?.uid;

  if (uid) {
    const storageKey = `Notfiy_${uid}`;

    console.log("fkkkkkkkkkkkkkkkkkkkkkk", this.switchNot());

    localStorage.setItem(storageKey, JSON.stringify(this.switchNot()));
  }
}




}
