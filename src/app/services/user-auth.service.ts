
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Task {
  id: number;
  priority: string;
  description: string;
  important: boolean;
  editing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  tasks: Task[] = [];
  deletedTasks: Task[] = [];
  searchTasks: Task[] = [];
  importantTasksSubject = new BehaviorSubject<Task[]>([]);
  deletedTasksSubject = new BehaviorSubject<Task[]>([]);
  private loginUrl = 'https://dummyjson.com/auth/login';
  isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.updateImportantTasks();
    }
    this.fetchDeletedTasksFromLocalStorage();
  }
  isUserLogged(){
    return this.isLogged.value; 
  }
  
  login(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.loginUrl, body, { headers: headers });
  }

  storeTask(task: Task): void {
    this.tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.searchTasks.push(task);
    this.updateImportantTasks();
  }

  deleteTask(taskId: number): void {
    const deletedTaskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (deletedTaskIndex !== -1) {
      const deletedTask = this.tasks.splice(deletedTaskIndex, 1)[0];
      const searchTaskIndex = this.searchTasks.findIndex(task => task.id === taskId);
      if (searchTaskIndex !== -1) {
        this.searchTasks.splice(searchTaskIndex, 1);
        localStorage.setItem('searchTasks', JSON.stringify(this.searchTasks));
      }
      this.deletedTasks.push(deletedTask);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks))
      this.updateImportantTasks();
      this.deletedTasksSubject.next(this.deletedTasks);
      this.fetchDeletedTasksFromLocalStorage()
    }
  }

  restoreTask(task: Task): void {
    const restoredTaskIndex = this.deletedTasks.findIndex(t => t.id === task.id);
    if (restoredTaskIndex !== -1) {
      const restoredTask = this.deletedTasks.splice(restoredTaskIndex, 1)[0];
      this.tasks.push(restoredTask);
      this.searchTasks.push(restoredTask);
      this.searchTasks.push(restoredTask);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
      this.updateImportantTasks();
      this.deletedTasksSubject.next(this.deletedTasks);
    }
  }

  deletePermanently(task: Task): void {
    const deletedTaskIndex = this.deletedTasks.findIndex(t => t.id === task.id);
    if (deletedTaskIndex !== -1) {
      this.deletedTasks.splice(deletedTaskIndex, 1);
      localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
      this.deletedTasksSubject.next(this.deletedTasks);
      
    }
  }
  fetchDeletedTasksFromLocalStorage(): void {
    const storedDeletedTasks = localStorage.getItem('deletedTasks');
    if (storedDeletedTasks) {
      this.deletedTasks = JSON.parse(storedDeletedTasks);
      this.deletedTasksSubject.next(this.deletedTasks);
    }
  }

  private updateImportantTasks(): void {
    const importantTasks = this.tasks.filter(task => task.important);
    this.importantTasksSubject.next(importantTasks);
  }
  filterTasksByPriority(priority: string): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }
}
