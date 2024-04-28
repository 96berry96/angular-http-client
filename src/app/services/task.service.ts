import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Task } from '../model/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http: HttpClient = inject(HttpClient);

  CreateTask(task: Task){
    const headers = new HttpHeaders({'my-header':'hello-world'})
    this.http.post<{name: string}>(
      'https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json', task, {headers: headers })
      .subscribe();
  }

  DeleteTask(id: string | undefined){
    this.http.delete(`https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks/${id}.json`)
      .subscribe({
        next: (res) => {
          console.log(res);
          //this.fetchAllTasks();
        }
      });
  }

  DeleteAllTask(){
    this.http.delete('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json')
      .subscribe({
        next: (res) => {
          console.log(res);
          //this.fetchAllTasks();
        }
      })
  }


  GetAllTasks(){
    return this.http.get<{[key:string]: Task}>('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json')
      .pipe(map((response)=>{
        let tasks = [];
        for(let key in response){
          if(response.hasOwnProperty(key)){
            tasks.push({...response[key], id:key});
          }
        }

        return tasks;
      }))
  }

  UpdateTask(id: string | undefined, data: Task){
   this.http.put('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks/'+id+'.json', data) 
    .subscribe();
  }
}
