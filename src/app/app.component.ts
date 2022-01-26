import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  role: number = 0;
  uName = "";

  @Input() selectedUser = '1';

  constructor(private router: Router,
    private sharedService: SharedService) {
      var a = this.sharedService.userID;
      var b = this.sharedService.userName;

      if(a !== null)
        this.role = parseInt(a);
      if(b !== null)
        this.uName = b + "";
    }
  
  ngOnInit() {

    var o = localStorage.getItem('acs');

    this.access = JSON.parse(o + "") === true;
  }


  hide: any;

  loginDev() {

    console.log("R: " + this.role + " U: " + this.uName)
    this.role = parseInt(this.role + "");

    if(this.role === 52112 || this.role === 27695 || this.role === 90091 
    || this.role === 60316 || this.role === 21554 || this.role === 21551) {

      if(this.uName === "Alen" || this.uName === "Ata" || this.uName === "Tjaša" || this.uName === "Teo") {


        this.accessMsg = 'Dobrodošli, ' +  this.uName + 
        '! . . .';
        
        this.setUser();

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

  setUser() {
    this.sharedService.setUser(this.role + "", this.uName);

    let uri = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }
}
