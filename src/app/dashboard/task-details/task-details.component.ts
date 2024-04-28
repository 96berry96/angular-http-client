import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  @Output()
  CloseDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  OnCloseDetailView() {
    this.CloseDetailView.emit(false);
  }
}
