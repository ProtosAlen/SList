import { Component, Input } from '@angular/core';
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
  title = 'S-List';
  appVersion = "0.1.40";

  access = false;
  accessMsg = 'Vnesite ime in geslo:';
  role: number = 0;
  uName = "";

  @Input() selectedUser = '1';

  tst = 1;

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

  // ITEM DONE
  save(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = 1;

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
          this.list = await v.projects;

          const doneFilter = this.list.filter(p => (p.done === 1).toString());
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


}
