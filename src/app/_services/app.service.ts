import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  user = '1';

  setUser(id: string) {
    this.user = id;
  }

  getUser() {
    return this.user;
  }
}
