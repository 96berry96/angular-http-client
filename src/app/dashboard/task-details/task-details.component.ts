import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../model/Task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  @Output()
  CloseDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  currentTask: Task | null = null;

  OnCloseDetailView() {
    this.CloseDetailView.emit(false);
  }
}
