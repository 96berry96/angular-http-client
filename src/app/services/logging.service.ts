import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  http: HttpClient = inject(HttpClient);
  logError(data: {statusCode: number, errorMessage: string, datetime: Date}){
    this.http.post('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/log.json', data)
      .subscribe();
  }

  fetchErrors(){
    this.http.get('https://angularhttpclient-d8427-default-rtdb.firebaseio.com/log.json')
      .subscribe({
        next: (data) => {
          console.log(data);
          
        }
      })
  }
}
