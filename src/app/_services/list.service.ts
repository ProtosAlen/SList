import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { List } from '../_interfaces/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private baseUrl = 'https://api.infofix.eu/list/projects/';  // BASE REST API URL
  /*
    read
    read-one
    create
    update
    delete?
  */

  constructor(
    private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
  };

  /** GET ALL Items. */
  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + "read.php", this.httpOptions)
  }

  /** POST: ADD Item */
  addItem(project: any): Observable<any> {
    console.log(project);
    return this.http.post<any>(this.baseUrl + "create.php", project, this.httpOptions).pipe(
      tap((newProject: any) => console.log(`Service Created Item ID: ${newProject.name}`))
    );
  }

  /** POST: UPDATE Item */
  updateItem(itm: List): Observable<any> {
    return this.http.post(this.baseUrl + "update.php", itm, this.httpOptions).pipe(
      tap(_ => console.log(`Service Updated Item ID: ${itm.id}`)),
    );
  }

}
