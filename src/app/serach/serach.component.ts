import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Task, UserAuthService } from '../services/user-auth.service';

@Component({
  selector: 'app-serach',
  templateUrl: './serach.component.html',
  styleUrls: ['./serach.component.scss']
})
export class SerachComponent implements OnInit {
  searchForm: FormGroup;
  searchedTasks: Task[] = [];
  search: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''] 
    });
  }

  searchFunction() {
    const searchTerm = this.searchForm.get('searchTerm').value;
    console.log("seacrh item", searchTerm);
    this.searchedTasks = this.userAuthService.filterTasksByPriority(searchTerm);
    this.search = true;
  }
}
