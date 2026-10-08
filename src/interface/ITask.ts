export interface ITask {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  color: string;
  createdAt: string | null;
  completedAt: string | null;
  deleteAt?: number | null;
  note: string;
  icon: string | null;
  ID: string;
  num: string;
  firebaseId: string;
  UID?:string ;
}
