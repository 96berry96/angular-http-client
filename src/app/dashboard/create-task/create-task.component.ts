import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../model/Task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements AfterViewInit{
  @Input() isEditMode: boolean = false;
  @Input() selectedTask: Task;
  @ViewChild('taskForm') taskForm: NgForm;

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.taskForm.form.patchValue(this.selectedTask);
    },0)
      
  }

  OnCloseForm(){
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form:NgForm){
    this.EmitTaskData.emit(form.value);
    this.CloseForm.emit(false);
    //console.log(form.value);
  }
}
