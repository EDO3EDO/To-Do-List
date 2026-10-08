import { PersonalSerService } from './../../services/PersonalSer.service';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { signal , computed } from '@angular/core';
import { ITask } from '../../interface/ITask';
import { ViewChildren , QueryList ,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from "@angular/router";
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit  {

  private PersonalSerService = inject(PersonalSerService)

  @ViewChildren('inputTask') taskinput!:QueryList<ElementRef>

  constructor() {}





  IsLoding = signal<boolean>(true)

  ngOnInit(): void {



    this.PersonalSerService.getItem().subscribe({
      next: (pers) => {this.tasks.set(pers)
        this.IsLoding.set(false)
      },
      error: (pers) => {console.log(pers),
        this.IsLoding.set(false)
      }
    })




    setInterval(() => {
      this.removetask()
    },30000)




  }


  tasks = signal<ITask[]>([]);

  Cheack:boolean = false;
  token!:string;



saveTask(event:any){
  localStorage.setItem("MyTask" ,JSON.stringify(this.tasks()));
  (event.target as HTMLInputElement).blur();
  console.log("Enter")

}



viwe:boolean = false;
note = signal({
  note:" ",
  icon:" "
})




newnote(newnote:string){
  this.note.update( prev => ({...prev , note:newnote}))
}




viweall(){
  this.viwe = !this.viwe

}








cheack(id:number , firebaseId:string ){


  const now  = new Date()
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

  this.tasks.update(currnt => currnt.map(task => {
    if(task.id === id){
      const complet = !task.completed;
      return{
        ...task,
        completed:complet,
        completedAt: complet === true ? timeString : null,
        deleteAt: complet ? Date.now() + (10*60*1000) : null
      }
    }


    return task ;
  }))

  setTimeout(() => {
    this.SaveInFire(firebaseId);
  },0)


}


  removetask() {
    const now = Date.now();
    const hasExpired = this.tasks().filter((t => t.completed && t.deleteAt && now >= t.deleteAt))

    hasExpired.forEach(task => {
      if(task.firebaseId){
        this.PersonalSerService.deleteItem(task.firebaseId)
      }
    })

  }





RemainingTask = computed(() => {
  return this.tasks().filter(v => !v.completed).length
});

TaskCompleted = computed(() => {
  return this.tasks().filter(v => v.completed).length
});




selectIcon(icon: string) {
  this.note.update( prev => ({...prev , icon:icon}))
  setTimeout(() => {
    localStorage.setItem("icon" , JSON.stringify(this.note()))
  }, 0);
}


  async addNewTask() {
    const NewTask: ITask = ({
      id:Date.now(),
      UID:"",
      title: 'New Task',
      firebaseId: '',
      completed: false,
      priority: 'Add-Notes',
      note:this.note().note,
      icon:this.note().icon,
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
    });


    setTimeout(() => {
      const input =  this.taskinput.toArray()
      const task = input[input.length - 1]
      if(task){
        task.nativeElement.focus()
      }
    },0)


    try{
      const FirebaseId = await this.PersonalSerService.CreatItem(NewTask)
      NewTask.firebaseId = FirebaseId;
      this.SaveInFire(FirebaseId)
      console.log("gg")
    }catch(err){
      console.log("fk" , err)
    }






  }


  async SaveInFire(firebaseId:string){
    const task = this.tasks().find(v => v.firebaseId === firebaseId)
    if(task){
        this.PersonalSerService.UpdateItem(firebaseId , task)
    }
    return task
  }









saveoption(){
  this.newnote(this.note().note)
}



}
