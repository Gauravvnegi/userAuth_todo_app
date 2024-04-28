import { Component, OnInit } from '@angular/core';
import { Task, UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-important',
  templateUrl: './important.component.html',
  styleUrls: ['./important.component.scss']
})
export class ImportantComponent implements OnInit {
  importantTasks: Task[] = [];

  constructor(private userAuthService: UserAuthService) { }

  ngOnInit(): void {

    this.userAuthService.importantTasksSubject.subscribe(tasks => {
      this.importantTasks = tasks;
    });
  }

}
