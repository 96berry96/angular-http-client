import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../model/Task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);

  editMode:boolean = false;
  selectedTask: Task;
  currentTaskId: string = '';

  isLoading: boolean = false;

  errorMessage: string | null = null;

  private setErrorMessage(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorMessage = 'You do not have permission to perform this action.';
    }
    
  }

  ngOnInit(): void {
    this.fetchAllTasks();
  }

  OpenCreateTaskForm(){
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: '',
      desc: '',
      assignedTo: '',
      createdAt: '',
      priority: '',
      status: '',
    }
  }


  CloseCreateTaskForm(){
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task){
    if(!this.editMode){
      this.taskService.CreateTask(data);
      this.fetchAllTasks();
    } else {
      this.taskService.UpdateTask(this.currentTaskId, data);
    }
    
  }

  FetchAllTaskClicked(){
    this.fetchAllTasks();
  }

  private fetchAllTasks(){
    this.isLoading = true;
    this.taskService.GetAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        
        this.setErrorMessage(error);
        this.isLoading = false;
        setTimeout(() => {
          this.errorMessage = null
        }, 3000)
      }
    })
  }



  DeleteTask(id: string | undefined){
    this.taskService.DeleteTask(id);
  }

  DeleteAllTasks(){
    this.taskService.DeleteAllTask();
  }

  OnEditTaskClicked(id: string | undefined){
    this.currentTaskId = id;

    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id
    })
  }

}
