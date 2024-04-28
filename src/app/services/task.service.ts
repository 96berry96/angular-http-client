import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Task } from '../model/Task';
import { Subject, throwError } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  errorSubject = new Subject<HttpErrorResponse>();

  loggingService: LoggingService = inject(LoggingService);

  CreateTask(task: Task){
    const headers = new HttpHeaders({'my-header':'hello-world'})
    this.http.post<{name: string}>(
      'https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json', task, {headers: headers })
      .subscribe({
        error: (error) => {
          this.errorSubject.next(error)
        }
      });
  }

  DeleteTask(id: string | undefined){
    this.http.delete(`https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks/${id}.json`)
      .subscribe({
        next: (res) => {},
        error: (error) => {
          this.errorSubject.next(error)
        }
      });
  }

  DeleteAllTask(){
    this.http.delete('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json', {observe: 'events', responseType: 'json'})
      .pipe(
        tap((event)=>{
          console.log(event);
          if(event.type === HttpEventType.Sent){

          }
        }),
        catchError((err)=>{
          const errorObj = {statusCode: err.status, errorMessage: err.message, datetime: new Date}
          this.loggingService.logError(errorObj);
          return throwError(()=>err)
      }))
      .subscribe({
        next: (res) => {},
        error: (error) => {
          this.errorSubject.next(error)
        }
      })
  }

  


  GetAllTasks(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Access-Control-Allow-Origin', '*');

    let queryParams: HttpParams = new HttpParams();
    //queryParams = queryParams.set('page', 2);
    //queryParams = queryParams.set('item', 10);
    
    return this.http.get<{[key:string]: Task}>('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks.json', 
    {headers:headers, params: queryParams, observe:'body'})
      .pipe(map((response)=>{
        console.log(response);
        
        let tasks = [];
        for(let key in response){
          if(response.hasOwnProperty(key)){
            tasks.push({...response[key], id:key});
          }
        }

        return tasks;
      }), 
      catchError((err)=>{
        const errorObj = {statusCode: err.status, errorMessage: err.message, datetime: new Date}
        this.loggingService.logError(errorObj);
        return throwError(()=>err)
      }))
  }

  getTaskDetails(id: string | undefined){
    return this.http.get('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks/'+id+'.json')
      .pipe(map((response)=>{
        let task = {};
        task = {...response, id:id};
        return task;
      }))   
  }

  UpdateTask(id: string | undefined, data: Task){
   this.http.put('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/tasks/'+id+'.json', data) 
    .subscribe({
      error: (error) => {
        this.errorSubject.next(error)
      }
    });
  }
}
