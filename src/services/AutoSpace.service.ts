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
export class AutoSpaceService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  collectionName = "Auto";

  Space = signal<LIST[]>([]);
  tasks = signal<ITask[]>([]);
  IsLoding  = signal<boolean>(true)
  @ViewChildren('inputTask') taskinput!: ElementRef;
  note = signal({ note: "", icon: " " });

  constructor() {
    this.getItem().subscribe({
      next: (pars) => {
        this.tasks.set(pars);
        this.IsLoding.set(false)
        console.log("gg - Auto tasks loaded");
      },
      error: (hello) => { console.log("fk - Auto tasks error", hello);
        this.IsLoding.set(false)
      }
    });
  }

  async creatItem(data: ITask): Promise<string> {
    const user = this.auth.currentUser;
    const ItemDoc = collection(this.firestore, this.collectionName);
    const taskWithUid = {
      ...data,
      UID: user ? user.uid : ""
    };
    const docRef = await addDoc(ItemDoc, taskWithUid);
    return docRef.id;
  }

  getItem(): Observable<ITask[]> {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        return new Observable<ITask[]>((observ) => {
          const ItemDoc = collection(this.firestore, this.collectionName);
          const q = query(ItemDoc, where('UID', '==', user.uid));

          const space = onSnapshot(q, (snap) => {
            const Auto = snap.docs.map(t => ({
              ...(t.data() as ITask),
              firebaseId: t.id,
              UID: user.uid
            }));
            observ.next(Auto);
          }, (erorr) => {
            console.log(erorr);
            observ.error(erorr);
          });

          return () => space();
        });
      })
    );
  }

  async UpdateItem(data: ITask, firebaseId: string): Promise<any> {
    const ItemDoc = doc(this.firestore, `${this.collectionName}/${firebaseId}`);
    return updateDoc(ItemDoc, { ...data });
  }

  async deleteItem(firbaseId: string): Promise<any> {
    const ItemDoc = doc(this.firestore, `${this.collectionName}/${firbaseId}`);
    return deleteDoc(ItemDoc);
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
      this.SaveInFire(firebaseId);
    }, 0);
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
      this.SaveInFire(FirebaseId);
    } catch {
      console.log("fk");
    }

    this.note.set({ note: "", icon: " " });
  }

  getCountById(spaceId: string): number {
    return this.tasks().filter(task => task.ID === spaceId).length;
  }

  SaveInFire(firebaseId: string) {
    const task = this.tasks().find(v => v.firebaseId === firebaseId);
    if (task) {
      this.UpdateItem(task, firebaseId);
    }
    return task;
  }

}
