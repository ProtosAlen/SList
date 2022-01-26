import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userID: any;
  userName: any;

  constructor(){
    //this.userID = 3;
    //this.userName = 'Bob';
  }

  setUser(val: number, n: string): void {
    this.userID = val;
    this.userName = n;
    console.log('DEV-ID: ' + this.userID);
  }

  getUser(): number {
    return this.userID;
  }
}
