import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Task } from '../model/Task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { TaskService } from '../services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);

  editMode:boolean = false;
  selectedTask: Task;
  currentTaskId: string = '';

  //Toas Options
  isLoading: boolean = false;

  //Error subject Options
  errorMessage: string | null = null;
  errorSub: Subscription;

  //TaskDetail options
  showTaskDetails: boolean = false;
  currentTask: Task | null = null;

  private setErrorMessage(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorMessage = 'You do not have permission to perform this action.';
    } else{
      this.errorMessage = err.message;
    }
    
  }

  ngOnInit(): void {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next:(httpError)=>{
        this.setErrorMessage(httpError);
      }
    })
  }

  ngOnDestroy(): void {
      this.errorSub.unsubscribe();
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

  showCurrentTaskDetails(id: string | undefined){
    this.showTaskDetails = true
    this.taskService.getTaskDetails(id).subscribe({
      next: (data: Task)=>{
        this.currentTask = data;
      }
    })
  }

  CloseTaskDetails(){
    this.showTaskDetails = false
  }

}
