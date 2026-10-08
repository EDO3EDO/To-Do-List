import { ITask } from './../../interface/ITask';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Icategory } from '../../interface/Icategory';
import { FocusSerService } from '../../services/FocusSer.service';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { NotficationSerService } from '../../services/Notfication-ser.service';
import { Subscription } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { TimerService } from '../../services/Timer.service';

@Component({
  selector: 'app-Focus',
  templateUrl: './Focus.component.html',
  styleUrls: ['./Focus.component.css'],
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule]
})
export class FocusComponent implements OnInit, OnDestroy {
  private _firestore = inject(FocusSerService);
  private firestore = inject(Firestore);
  private Notfication = inject(NotficationSerService);
  private snapshotUnsubscribe: (() => void) | null = null;
  private tasksSubscription: Subscription | null = null;
  private Auth = inject(Auth)
  private timerService = inject(TimerService);



  private alarmAudio = new Audio('3dabrar-funny-alarm-317531.mp3');

  constructor() { }

  endTime: number = 0;
  selectid = signal<string | null>(null);
  hello = signal<number>(Date.now());
  hour = signal(0);
  minit = signal(0);
  scond = signal(0);
  remindscond = signal(0);
  isRuning = signal(false);
  interval: any;
  clockInterval: any;

  catigory = signal<Icategory>({
    Complete: false,
    title: " "
  });

  tasks = signal<ITask[]>([]);
  IsLoding =signal<boolean>(true)

  ngOnInit() {
    this.startLiveClock();

    this.tasksSubscription = this.timerService.getTimerSnapshot().subscribe({
      next: (endTime) => {
        if (endTime) {
          this.endTime = endTime;
          const totalRemind = Math.floor((this.endTime - Date.now()) / 1000);
          if (totalRemind > 0) {
            this.remindscond.set(totalRemind);
            this.start();
          } else {
            this.remindscond.set(0);
            this.isRuning.set(false);
          }
        }
      },
      error: (err) => console.error("Error with timer:", err)
    });

    this.tasksSubscription = this._firestore.getItem().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks),
        this.IsLoding.set(false)
      },

      error: (err) => {
        console.error("Error fetching tasks:", err),
        this.IsLoding.set(false)
      }
    });

    const local = localStorage.getItem("Catigory");
    if (local && local !== 'undefined') {
      try {
        this.catigory.set(JSON.parse(local));
      } catch (e) {
        localStorage.removeItem("Catigory");
      }
    }
  }

  async Save() {
    const timeEdit = (this.hour() * 3600) + (this.minit() * 60) + this.scond();
    if (timeEdit <= 0) return;

    this.endTime = Date.now() + (timeEdit * 1000);

    try {
      await this.timerService.updateTimer(this.endTime);
      this.start();
    } catch (err) {
      console.error("Failed to save timer:", err);
    }
  }

  ngOnDestroy() {
    if (this.snapshotUnsubscribe) {
      this.snapshotUnsubscribe();
    }
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startLiveClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => {
      this.hello.set(Date.now());
    }, 1000);
  }

  selectTask = computed(() => {
    const id = this.selectid();
    return this.tasks().find(v => v.firebaseId === id) || null;
  });

  viewTask(id: string) {
    this.selectid.set(id);
  }

  async SaveTask(task: ITask) {
    if (task.firebaseId) {
      try {
        await this._firestore.updateItem(task.firebaseId, task);
        console.log("gg");
        this.selectid.set(null);
      } catch (err) {
        console.log("fk", err);
      }
    }
  }

  async deleteTask() {
    const del = this.tasks().filter(v => v.completed);
    try {
      for (const task of del) {
        await this._firestore.deleteItem(task.firebaseId);
      }
    } catch {
      console.log("fk");
    }
  }

  UpdateCatigorytitle(newtitle: string) {
    this.catigory.update(prev => ({ ...prev, title: newtitle }));
    setTimeout(() => {
      localStorage.setItem("Catigory", JSON.stringify(this.catigory()));
    }, 0);
  }

  increment(type: 'h' | 'm' | 's') {
    if (type === 'h') this.hour.update(v => Math.min(v + 1, 24));
    if (type === 'm') this.minit.update(v => Math.min(v + 1, 60));
    if (this.minit() == 60) {
      this.hour.update(v => Math.min(v + 1, 24));
      this.minit.update(v => -1);
    }
    if (type === 's') this.scond.update(v => Math.min(v + 1, 60));
    if (this.scond() == 60) {
      this.minit.update(v => Math.min(v + 1, 60));
      this.scond.update(v => 0);
    }
  }

  decrment(type: 'h' | 'm' | 's') {
    if (type === 'h') this.hour.update(v => Math.max(v - 1, 0));
    if (type === 'm') this.minit.update(v => Math.max(v - 1, 0));
    if (type === 's') this.scond.update(v => Math.max(v - 1, 0));
  }

  pad(num: number) { return num.toString().padStart(2, "0"); }

  dalytime = computed(() => {
    const total = this.remindscond();
    const hh = Math.floor((total / 3600));
    const mm = Math.floor((total % 3600) / 60);
    const ss = Math.floor(total % 60);
    return `${this.pad(hh)}h ${this.pad(mm)}m ${this.pad(ss)}s`;
  });

  save() {
    const timeEdit = (this.hour() * 3600) + (this.minit() * 60) + this.scond();
    if (timeEdit <= 0) return;

    this.remindscond.set(timeEdit);
    this.endTime = Date.now() + (timeEdit * 1000);

    const timeDoc = doc(this.firestore, 'timer/currentTimer');
    setDoc(timeDoc, { endTime: this.endTime }).then(() => {
      this.start();
    });
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.isRuning.set(true);

    this.interval = setInterval(() => {
      const totalRemind = Math.floor((this.endTime - Date.now()) / 1000);

      if (totalRemind > 0) {
        this.remindscond.set(totalRemind);
      } else {
        this.remindscond.set(0);

        if (this.isRuning()) {
          this.stop();
          if (this.Notfication.switchNot()) {
            this.alarmAudio.currentTime = 0;
            this.alarmAudio.play().catch(e => console.log(e));
          }
        }
      }
    }, 1000);
  }

  stop() {
    this.isRuning.set(false);
    clearInterval(this.interval);
  }

  async addNewTask() {
    const Uid  = this.Auth.currentUser?.uid
    const NewTask: ITask = {
      id: Date.now(),
      title: 'New Task',
      firebaseId: '',
      UID: Uid,
      completed: false,
      priority: 'Add-Notes',
      note: " ",
      icon: " ",
      ID: " ",
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
      const firebaseId = await this._firestore.createItem(NewTask);
      NewTask.firebaseId = firebaseId;
    } catch (err) {
      console.log("firebase error", err);
    }
  }

  check(id: number) {
    const adu = new Audio('yamete-kudasai-mp3-(original)-made-with-Voicemod.mp3');
    let shouldPlaySound = false;

    this.tasks.update(v => v.map(curr => {
      if (id === curr.id) {
        const complet = !curr.completed;

        if (complet && this.Notfication.switchNot()) {
          shouldPlaySound = true;
        }

        return {
          ...curr,
          completed: complet
        };
      }
      return curr;
    }));

    if (shouldPlaySound) {
      adu.play().catch(e => console.log("Audio playback blocked", e));
    }
  }

  count = computed(() => this.tasks().length);
}
