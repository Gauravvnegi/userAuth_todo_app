import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  taskForm: FormGroup;
  editTaskForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public userAuthService: UserAuthService
  ) {
    this.taskForm = this.formBuilder.group({
      priority: ['', Validators.required],
      description: ['', Validators.required],
      important: [false]
    });

    this.editTaskForm = this.formBuilder.group({
      editPriority: ['', Validators.required],
      editDescription: ['', Validators.required],
      editImportant: [false]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const newTask: Task = {
      id: this.generateRandomId(),
      priority: this.taskForm.value.priority,
      description: this.taskForm.value.description,
      important: this.taskForm.value.important
    };

    this.userAuthService.storeTask(newTask);
    this.taskForm.reset();
  }
  generateRandomId(): number {
    return Math.floor(Math.random() * 1000000); 
  }
  editTask(task: Task): void {
    task.editing = !task.editing;
    if (task.editing) {
      this.editTaskForm.patchValue({
        editPriority: task.priority,
        editDescription: task.description,
        editImportant: task.important
      });
    }
  }

  onEditSubmit(task: Task): void {
    if (this.editTaskForm.invalid) {
      return;
    }
    task.priority = this.editTaskForm.value.editPriority;
    task.description = this.editTaskForm.value.editDescription;
    task.important = this.editTaskForm.value.editImportant;

    task.editing = false;
    
    this.editTaskForm.reset();
  }

  deleteTask(taskId: number): void {
    this.userAuthService.deleteTask(taskId);
  }
}
