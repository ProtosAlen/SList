import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userID = '1';
  userName: any;

  constructor(){
    localStorage.setItem('role', this.userID);
  }

  setUser(val: string, n: string): void {
    this.userID = val;
    this.userName = n;
    console.log('DEV-ID: ' + this.userID);
  }

  getUser(): string {
    return this.userID;
  }
}
