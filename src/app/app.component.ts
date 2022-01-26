import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './_services/app.service';
import { SharedService } from './_services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'S-List';
  appVersion = "0.1.20";

  access = false;
  accessMsg = 'Vnesi ime in geslo';
  role: any;
  uName = "";

  @Input() selectedUser = '1';

  constructor(private appService: AppService,
    private router: Router,
    private sharedService: SharedService) {}
  
  ngOnInit() {
    var a = localStorage.getItem('role');
    var b = localStorage.getItem('uName');
    var o = localStorage.getItem('acs');

    if(a !== null)
      this.selectedUser = a + "";
    if(b !== null)
      this.uName = b + "";
    this.access = JSON.parse(o + "") === true;
  }


  hide: any;

  loginDev() {
    if(this.role === 52112 
    || this.role === 27695 || this.role === 90091 || this.role === 60316
    || this.role === 29554 || this.role === 21551 || this.role === 88564 || this.role === 51294)
    {

      if(this.uName === "Alen" || this.uName === "Ata" || this.uName === "Tjaša" || this.uName === "Teo") {


        this.accessMsg = 'Dobrodošel ' +  this.uName + 
        '! . . .';
        
        this.sharedService.setUser(this.role, this.uName);

        localStorage.setItem('role', this.role + "");
        localStorage.setItem('uName', this.uName + "");

        setTimeout(() => 
        {
          this.access = true;
          localStorage.setItem('acs', this.access + "");
        },
        1000);
      }
      else {
        this.access = false;
        this.accessMsg = 'Napačno ime!'
      }

    }
    else {
      this.access = false;
      this.accessMsg = 'Napačno geslo!'
    }
  }

  setUser(id: string) {
    this.appService.setUser(id);

    let uri = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));

    console.log(this.selectedUser);
  }
}
