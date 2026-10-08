import { Component, OnInit, signal, computed, QueryList, ElementRef, ViewChildren, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ITask } from '../../interface/ITask';
import { FirebaseService } from '../../services/firebase.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-To-Do-List',
  templateUrl: './To-Do-List.component.html',
  imports: [FormsModule, CommonModule, MatIconModule],
  styleUrls: ['./To-Do-List.component.css']
})
export class ToDoListComponent implements OnInit {

  constructor(){
  }

  @ViewChildren('inputTask') taskinput!: QueryList<ElementRef>
  private _auth = inject(Auth);
  private FirebaseService = inject(FirebaseService);

  tasks = signal<ITask[]>([]);
  viwe = false;


  IsLoding = signal<boolean>(true)


  ngOnInit(): void {

    this.FirebaseService.getItem().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.IsLoding.set(false)
        console.log("data loaded")
      },
      error: (err) => {
        console.log("error loading data", err),
        this.IsLoding.set(false)
      }
    });

  const day = 1000 * 60 * 60 * 24;

    setInterval(() => {
      this.removetask();
    }, day);


  }



    progress = computed(() => {
    const all = this.tasks().length;
    if (all === 0) return 0;
    const completed = this.tasks().filter(t => t.completed).length;
    return Math.round((completed / all) * 100);
  })

  count = computed(() => this.tasks().length);



  viweall() {
    this.viwe = !this.viwe;
  }

  select(event: any, item: any) {
    const select = event.target.value;

    let color = "";

    switch (select) {
      case "Add-Notes": color = "#f5f6f7"; break;
      case "HIGH-PRIORITY": color = "#f74b6d"; break;
      case "STARTEGIC": color = "#A391ff"; break;
      case "ROUTINE": color = "#E6E8EA"; break;
      case "UPCOMING": color = "#FF8C42"; break;
      case "PENDING": color = "#F4D35E"; break;
      case "IN-PROGRESS": color = "#70D6FF"; break;
      case "CRITICAL": color = "#52B788"; break;
      default: color = "#f5f6f7";
    }

    item.color = color;
    item.priority = select;

  }

  cheack(id: number , firebaseId:string) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    this.tasks.update(tasks =>
      tasks.map(task => {
        if (task.id === id) {
          const completed = !task.completed;
          return {
            ...task,
            completed,
            completedAt: completed ? timeString : null,
            deleteAt: completed ? Date.now() + (1000 * 60 * 60 * 24) : null
          };
        }
        return task;
      })
    );
      this.saveInFire(firebaseId)
  }



  removetask() {
    const now = Date.now();
    const hasExpired = this.tasks().filter((
      t => t.completed && t.deleteAt && now >= t.deleteAt
    ))

    hasExpired.forEach(task => {
      if(task.firebaseId){
        this.FirebaseService.deletItem(task.firebaseId)
      }
    })



  }






  async addNewTask() {
    const Uid  = this._auth.currentUser?.uid
    const NewTask: ITask = {
      id:Date.now(),
      title: 'New Task',
      firebaseId: '',
      UID:Uid,
      completed: false,
      priority: 'Add-Notes',
      note:" ",
      icon:" ",
      ID:" ",
      num:"",
      color: 'gray',
      completedAt: null,
      createdAt: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      deleteAt: null
    };

    this.tasks.update(prev => [...prev, NewTask]);

    setTimeout(() => {
      const input = this.taskinput.toArray();
      const last = input[input.length - 1];
      last?.nativeElement?.focus();
    }, 0);

    try {
      const firebaseId = await this.FirebaseService.CreatItem(NewTask);
      NewTask.firebaseId = firebaseId;
      this.saveInFire(firebaseId);
    } catch (err) {
      console.log("firebase error", err);
    }
  }

  saveInFire(firebaseId: string) {
    const update = this.tasks().find(t => t.firebaseId === firebaseId);

    if (update) {
      this.FirebaseService.UpdateItem(firebaseId, update);
    }
  }









// animation Circel
















}
