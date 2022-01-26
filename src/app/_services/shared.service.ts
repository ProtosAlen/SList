import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userID = '1';
  userName: any;

  constructor(){
    this.userID = localStorage.getItem('role') + "";
    this.userName = localStorage.getItem('uName');
  }

  setUser(val: string, n: string): void {
    this.userID = val;
    this.userName = n;

    localStorage.setItem('role', this.userID);
    localStorage.setItem('uName', this.userName);
    console.log('ID: ' + this.userID + " UN: " + this.userName);
  }

  getUser(): string {
    return this.userID;
  }
}
