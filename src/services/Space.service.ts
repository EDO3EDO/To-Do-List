import { AfterViewInit, ElementRef, inject, Injectable, OnInit, QueryList, ViewChildren } from '@angular/core';
import { signal, computed } from '@angular/core';
import { LIST } from '../interface/LIST';
import { ITask } from '../interface/ITask';
import { effect } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  CollectionName = "Space";
  CollectionSpace = "Suiii";

  Space = signal<LIST[]>([]);
  tasks = signal<ITask[]>([]);
  IsLoding = signal<boolean>(true)

  @ViewChildren('inputTask') taskinput!: ElementRef;
  note = signal({ note: "", icon: " " });

  constructor() {
    this.getItem().subscribe({
      next: (pars) => {
        this.tasks.set(pars);
        this.IsLoding.set(false)
        console.log("gg - Tasks loaded");
      },
      error: (pars) => { console.log("fk - Tasks error", pars);
        this.IsLoding.set(false)
      }
    });


    this.getSpace().subscribe({
      next: (pars) => {
        this.Space.set(pars);
        console.log("gg - Spaces loaded");
      },
      error: (pars) => { console.log("fk - Spaces error", pars); }
    });
  }


  async creatItem(data: ITask): Promise<string> {
    const user = this.auth.currentUser;
    const itemCollection = collection(this.firestore, this.CollectionName);
    const taskWithUid = {
      ...data,
      UID: user ? user.uid : ""
    };
    const docRef = await addDoc(itemCollection, taskWithUid);
    return docRef.id;
  }


  getItem(): Observable<ITask[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        return new Observable<ITask[]>((observer) => {
          const itemDoc = collection(this.firestore, this.CollectionName);
          const q = query(itemDoc, where('UID', '==', user.uid));

          const task = onSnapshot(q, (snap) => {
            const space = snap.docs.map(t => ({
              ...(t.data() as ITask),
              firebaseId: t.id,
              UID: user.uid
            }));
            observer.next(space);
          }, (error) => {
            console.log(error);
            observer.error(error);
          });

          return () => task();
        });
      })
    );
  }

  async UpdateItem(data: ITask, firebaseId: string): Promise<any> {
    const ItemDoc = doc(this.firestore, `${this.CollectionName}/${firebaseId}`);
    return updateDoc(ItemDoc, { ...data });
  }

  async deleteItem(firebaseId: string): Promise<any> {
    const itemDoc = doc(this.firestore, `${this.CollectionName}/${firebaseId}`);
    return deleteDoc(itemDoc);
  }


  async creatSpace(data: LIST): Promise<string> {
    const user = this.auth.currentUser;
    const ItemDoc = collection(this.firestore, this.CollectionSpace);
    const spaceWithUid = {
      ...data,
      UID: user ? user.uid : ""
    };
    const docRef = await addDoc(ItemDoc, spaceWithUid);
    return docRef.id;
  }


  getSpace(): Observable<LIST[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        return new Observable<LIST[]>((observ) => {
          const ItemDoc = collection(this.firestore, this.CollectionSpace);
          const q = query(ItemDoc, where('UID', '==', user.uid));

          const list = onSnapshot(q, (snap) => {
            const space = snap.docs.map(t => ({
              ...(t.data() as LIST),
              firebaseId: t.id,
              UID: user.uid
            }));
            observ.next(space);
          }, (error) => {
            console.log(error);
            observ.error(error);
          });

          return () => list();
        });
      })
    );
  }

  async UpdateSpace(data: LIST, firebaseId: string): Promise<any> {
    const ItemDoc = doc(this.firestore, `${this.CollectionSpace}/${firebaseId}`);
    return updateDoc(ItemDoc, { ...data });
  }

  async deleteSpace(id: string): Promise<any> {
    const ItemDoc = doc(this.firestore, `${this.CollectionSpace}/${id}`);
    return deleteDoc(ItemDoc);
  }

  ///////////////////////// end space doc //////////////////////

  async addNewSpace() {
    const NewSpace: LIST = {
      icon: this.note().icon,
      note: this.note().note,
      id: Date.now().toString(),
      firebaseId: " ",
    };

    try {
      const FirebaseId = await this.creatSpace(NewSpace);
      NewSpace.firebaseId = FirebaseId;
      this.savespace(FirebaseId);
    } catch (err) {
      console.log("fk", err);
    }

    this.note.set({ note: " ", icon: " " });
  }

  newnote(val: string) {
    this.note.update(prev => ({ ...prev, note: val }));
  }

  selectIcon(icon: string) {
    this.note.update(prev => ({ ...prev, icon: icon }));
  }

  cheack(id: number, firebaseId: string) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    this.tasks.update(currnt => currnt.map(task => {
      if (task.id === id) {
        const complet = !task.completed;
        return {
          ...task,
          completed: complet,
          completedAt: complet === true ? timeString : null,
          deleteAt: complet ? Date.now() + (10 * 60 * 1000) : null
        };
      }
      return task;
    }));

    setTimeout(() => {
      this.saveInFire(firebaseId);
    }, 0);
  }

  removetask() {
    const now = Date.now();
    const hasExpired = this.tasks().some(t => t.completed && t.deleteAt && now >= t.deleteAt);
    if (hasExpired) {
      this.tasks.update(curr => {
        const updatedTasks = curr.filter(t => !t.completed || !t.deleteAt || now < t.deleteAt);
        return updatedTasks;
      });
      console.log('deleted');
    }
  }

  savespace(firebseId: string) {
    const space = this.Space().find(v => v.firebaseId === firebseId);
    if (space) {
      this.UpdateSpace(space, firebseId);
    }
  }

  RemainingTask = computed(() => {
    return this.tasks().filter(v => !v.completed).length;
  });

  TaskCompleted = computed(() => {
    return this.tasks().filter(v => v.completed).length;
  });

  async addNewTask(IDS: string) {
    const user = this.auth.currentUser;
    const NewTask: ITask = {
      id: Date.now(),
      UID: user ? user.uid : "",
      title: 'New Task',
      firebaseId: '',
      completed: false,
      priority: 'Add-Notes',
      note: this.note().note,
      icon: this.note().icon,
      ID: IDS,
      num: "",
      color: 'gray',
      completedAt: null,
      createdAt: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      deleteAt: null
    };

    try {
      const FirebaseId = await this.creatItem(NewTask);
      NewTask.firebaseId = FirebaseId;
      this.saveInFire(FirebaseId);
      console.log("gg");
    } catch (err) {
      console.log("fk", err);
    }
    this.note.set({ note: "", icon: " " });
  }

  async saveInFire(firbaseId: string) {
    const task = this.tasks().find(v => v.firebaseId === firbaseId);
    if (task) {
      this.UpdateItem(task, firbaseId);
    }
    return task;
  }

  getCountById(spaceId: string): number {
    return this.tasks().filter(task => task.ID === spaceId).length;
  }
}
