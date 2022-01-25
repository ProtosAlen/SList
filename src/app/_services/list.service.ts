import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap, map } from 'rxjs/operators';
import { List } from '../_interfaces/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private readOneUrl = 'https://api.infofix.eu/list/projects/read-one.php';  // URL to web api /read-one.php
  
  private readUrl = 'https://api.infofix.eu/list/projects/read.php';  // URL to web api /read.php
  private createUrl = 'https://api.infofix.eu/list/projects/create.php';  // URL to web api /read.php
  private updateUrl = 'https://api.infofix.eu/list/projects/update.php';  // URL to web api /read.php

  private deleteUrl = 'https://api.infofix.eu/if/projects/delete.php';  // URL to web api /read.php
  
  constructor(
    private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  getProjectsOLD(): Observable<Project[]> {
    this.messageService.add('ProjectService: Fetched Projects');
    return of(PROJECTS);
  }
*/

  /** GET ALL PROJECTS. Will 404 if id not found */
  getProjs(): Observable<any> {
    return this.http.get(this.readUrl);
  }

  /** GET PROJECT by id. Will 404 if id not found */
  getProject(id: number): Observable<any> {
    const url = `${this.readOneUrl}?id=${id}`; // REad one url
    return this.http.get<List>(url).pipe(
      tap(_ => console.log(`fetched project id=${id}`)),
      catchError(this.handleError<List>(`getProject id=${id}`))
    );
  }

  /** POST: UPDATE the Project on the server */
  updateProj(project: List): Observable<any> {
    console.log(project);
    return this.http.post(this.updateUrl, project, this.httpOptions).pipe(
      tap(_ => console.log(`updated project id=${project.id}`)),
      catchError(this.handleError<List>(`updated project id=${project.id}`))
    );
  }




  /** POST: add a new hero to the server */
  addProject(project: List): Observable<List> {
    return this.http.post<List>(this.createUrl, project, this.httpOptions).pipe(
      tap((newProject: List) => console.log(`added project w/ id=${newProject.id}`)),
      catchError(this.handleError<List>('addProject'))
    );
  }

  /** DELETE: project from the server */
  deleteProject(project: List | number): Observable<List> {
    const id = typeof project === 'number' ? project : project.id;
    const url = `${this.deleteUrl}?id=${id}`;

    return this.http.delete<List>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted project id=${id}`)),
      catchError(this.handleError<List>('deleteProject'))
    );
  }



/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
