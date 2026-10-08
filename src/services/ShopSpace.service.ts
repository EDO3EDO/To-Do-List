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
export class ShopSpaceService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  shopingName = "shopingspace";

  constructor() {
    this.getItem().subscribe({
      next: (pars) => {
        this.tasks.set(pars);
        this.IsLoding.set(false)
        console.log("gg - Shop tasks loaded");
      },
      error: (pars) => { console.log("fk - Shop tasks error", pars);
        this.IsLoding.set(false)
      }
    });
  }

  Space = signal<LIST[]>([]);
  tasks = signal<ITask[]>([]);
  IsLoding = signal<boolean>(true)


  async creatItem(data: ITask): Promise<string> {
    const user = this.auth.currentUser;
    const itemDoc = collection(this.firestore, this.shopingName);
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

        return new Observable<ITask[]>((observ) => {
          const itemDoc = collection(this.firestore, this.shopingName);
          const q = query(itemDoc, where('UID', '==', user.uid));

          const shoping = onSnapshot(q, (snap) => {
            const task = snap.docs.map(t => ({
              ...(t.data() as ITask),
              firebaseId: t.id,
              UID: user.uid
            }));
            observ.next(task);
          }, (error) => {
            console.log(error);
            observ.error(error);
          });

          return () => shoping();
        });
      })
    );
  }

  async updateItem(firebaseId: string, data: ITask): Promise<any> {
    const itemDoc = doc(this.firestore, `${this.shopingName}/${firebaseId}`);
    return updateDoc(itemDoc, { ...data });
  }

  async deleteItem(firbaseId: string): Promise<any> {
    const itemDoc = doc(this.firestore, `${this.shopingName}/${firbaseId}`);
    return deleteDoc(itemDoc);
  }

  @ViewChildren('inputTask') taskinput!: ElementRef;
  note = signal({ note: "", icon: " " });

  newnote(val: string) {
    this.note.update(prev => ({ ...prev, note: val }));
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
      this.saveInfire(firebaseId);
    }, 0);
  }

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
      this.saveInfire(FirebaseId);
      console.log("gg");
    } catch (err) {
      console.log("fk", err);
    }

    this.note.set({ note: "", icon: " " });
  }

  async saveInfire(firebaseId: string) {
    const task = this.tasks().find(v => v.firebaseId === firebaseId);
    if (task) {
      this.updateItem(firebaseId, task);
    }
    return task;
  }

  removetask() {
    const now = Date.now();
    const hasExpired = this.tasks().filter(t => t.completed && t.deleteAt && now >= t.deleteAt);
    hasExpired.forEach(task => {
      if (task.firebaseId) {
        this.deleteItem(task.firebaseId);
      }
    });
    console.log('deleted');
  }

  //////////////////////// Task Counter //////////////////////////////////

  RemainingTask = computed(() => {
    return this.tasks().filter(v => !v.completed).length;
  });

  TaskCompleted = computed(() => {
    return this.tasks().filter(v => v.completed).length;
  });

  getCountById(spaceId: string): number {
    return this.tasks().filter(task => task.ID === spaceId).length;
  }

}
