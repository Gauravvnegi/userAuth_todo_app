import { Component, OnInit } from '@angular/core';
import { Task, UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  deletedTasks: Task[] = [];

  constructor(private userAuthService: UserAuthService) { }

  ngOnInit(): void {
 
    this.userAuthService.deletedTasksSubject.subscribe(deletedTasks => {
      this.deletedTasks = deletedTasks;
    });
  }

  restoreTask(task: Task): void {
    this.userAuthService.restoreTask(task);
  }

  deletePermanently(task: Task): void {
    this.userAuthService.deletePermanently(task);
  }

}
