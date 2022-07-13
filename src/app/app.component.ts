import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { List } from './_interfaces/list';
import { ListService } from './_services/list.service';
import { SharedService } from './_services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  
  title = 'S-List';
  appVersion = "0.1.40";

  access = false;
  accessMsg = 'Vnesite ime in geslo:';
  role: number = 0;
  uName = "";

  @Input() selectedUser = '1';

  headerTxt = "Za nabavo"
  selPage = 1;

  constructor(private router: Router,
    private sService: SharedService,
    private listService: ListService) {
    var a = this.sService.userID;
    var b = this.sService.userName;

    if (a !== null)
      this.role = parseInt(a);
    if (b !== null)
      this.uName = b + "";
  }

  ngOnInit() {

    var o = localStorage.getItem('acs');

    this.access = JSON.parse(o + "") === true;


    // GET ALL ITEMS
    this.getList();
  }

  setPage(i: number) {
    this.selPage = i;

    this.getList();

    if(this.selPage == 0) {
      this.headerTxt = "V zalogi"
    }
    else if(this.selPage == 1) {
      this.headerTxt = "Za nabavo"
    }
  }

  logout(): void {
    localStorage.clear();
    this.access = false;
    this.accessMsg = 'Ponovno se prijavite:';
  }




  hide: any;

  loginDev() {

    //console.log("R: " + this.role + " U: " + this.uName)
    this.role = parseInt(this.role + "");

    if (this.role === 52112 || this.role === 27695 || this.role === 90091
      || this.role === 60316 || this.role === 21554 || this.role === 21551) {

      if (this.uName === "Alen" || this.uName === "Ata" || this.uName === "Tjaša" || this.uName === "Teo") {


        this.accessMsg = 'Dobrodošli, ' + this.uName +
          '! . . .';

        this.setUser();

        setTimeout(() => {
          this.access = true;
          localStorage.setItem('acs', this.access + "");
        },
          900);
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
    this.sService.setUser(this.role + "", this.uName);

    let uri = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }






  @Input() list: List[] = [];

  loading = false;
  errorMessage!: string;

  uID: string = this.sService.getUser().toString();

  selItem!: List;

  small: boolean = false;

  done: number = 0;

  

  trackByFn(i: number) {
    return i
  }

  // REMOVE ITEM
  remove(i: number): void {
    this.listService.deleteProject(i)
      .subscribe(
        (response) => {                           // next() callback
          //console.log('Item Removed', i);
          this.list.splice(i, 1);
          //this.getList();
        },
      );
  }

  // MOVE ITEM - Za nabavo <> V zalogi 
  save(i: number): void {
    this.selItem = this.list[i];
    if(this.selPage == 0) {
      this.selItem.done = 1;
    }
    else {
      this.selItem.done = 0;
    }


    this.list.splice(i, 1);

    this.listService.updateProj(this.selItem)
      .subscribe();
  }

  // TRASH ITEM
  trash(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = 2;

    this.list.splice(i, 1);

    this.listService.updateProj(this.selItem)
      .subscribe();
  }

  getList(): void {
    this.loading = true;
    this.errorMessage = '';
    this.listService.getAll()
      .subscribe({
        next: async (v) => {
          console.log(v)
          console.log('Projects Loaded');
          var tl;
          this.list = v.projects;

          console.log(this.selPage)
          const doneFilter = this.list.filter(p => (p.done.toString() === this.selPage.toString()));
          this.list = doneFilter;

          const userFilter = this.list.filter(p => p.user_id === this.sService.getUser() + "");
          this.list = userFilter;

          this.list.sort((b, a) => a.id.toString().localeCompare(b.id.toString()));
          this.list.sort((b, a) => a.pri.toString().localeCompare(b.pri.toString()));
          //this.list.sort((b, a) => a.ord.toString().localeCompare(b.ord.toString())); TODO: Sort by order number, not priority
        },
        error: (e) => {
          console.error('Error Loading Projects', e);
          this.errorMessage = e;
          this.loading = false;
        },
        complete: () => {
          console.info('complete');
          this.loading = false;
        }
      });
  }



  projects: List[] = [];

  status: any;

  pName: string = "Test";
  pUserId: string = this.sService.getUser() + "";
  pUserName: string = this.sService.userName;
  pDone: number = 1;
  pImg: string = "infofix-test-banner-v5.png";
  pCatId = 0;
  pPri = 0;
  pOrd = 0;
  pDesc: string = "";

  add(): void {
    const name = this.pName.trim();
    const user_id = this.pUserId.toString();
    const done = this.pDone;
    const description = this.pDesc.trim();
    const pri = this.pPri;
    const ord = this.pOrd;
    const category_id = this.pCatId.toString();
    const img = this.pImg.toString();

    let customObj = new List();
    customObj.name = name;
    customObj.user_id = user_id;
    customObj.done = done;
    customObj.description = description;
    customObj.category_id = category_id;
    customObj.img = img;
    customObj.pri = pri;
    customObj.ord = ord;
    //this.pUserId = "";
    //this.pImg = "tes.png"; 



    //if (!name) { return; }
    //console.log(this.projects[0])
    //this.listService.addProject(this.projects[0]);



    if (!name) { return; }
    this.listService.addProject({ name, user_id, done, description, category_id, img, pri, ord } as any)
      .subscribe(project => {

        this.projects.push(customObj);
        //console.log(this.projects);
        //this.projects.push(project);

        this.status = 'Predmet dodan!';

        console.log(project);
        console.log(this.status);
        this.getList();
      });
  }

}
