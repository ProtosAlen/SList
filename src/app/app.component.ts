import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './_services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'S-List';

  @Input() selectedUser = '1';

  constructor(private appService: AppService, private router: Router) {
    this.selectedUser = this.appService.getUser();
  }

  setUser(id: string) {
    this.appService.setUser(id);

    let uri = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));

    console.log(this.selectedUser);
  }
}
