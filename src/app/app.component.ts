import { ApplicationRef, Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { List } from './_interfaces/list';
import { ListService } from './_services/list.service';
import { SharedService } from './_services/shared.service';

import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { timeout, take, catchError, Observable, concat, first, interval, throwError } from 'rxjs';

import packageJson from '../../package.json';
import { SwUpdate } from '@angular/service-worker';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('50ms', animate('150ms ease-in-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      stagger('5ms', animate('50ms ease-in-out', style({ opacity: 0 }))),
      { optional: true }
    )
  ])
]);

const taskState = trigger('taskState', [ // TODO: translate to opacity
  state('inactive', style({ opacity: 1 })),
  state('active', style({ opacity: 1 })),
  state('void', style({ opacity: 0, display: 'none' })),
  transition('* => void', [
    animate('1s ease-out', style({
      opacity: 0,
    }))
  ])
])

interface RegionsGroup {
  disabled?: boolean;
  name: string;
  region: Select[];
}

interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [listAnimation, taskState]
})
export class AppComponent {


  isChecked = true; // Sort by Priority

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  title = 'S-List';
  public appVersion: string = packageJson.version;

  // LOGIN
  access = false;
  accessMsg = 'Vnesite ime in geslo:';
  hidePass: any;
  role: number = 0;
  uName = "";
  uID: string = this.sService.getUser().toString();

  // PAGE SETTINGS
  headerTxt = "ZA NABAVO"
  selPage = 1;
  small: boolean = false;

  // LIST
  list: List[] = [];
  @Input() selItem!: List;
  done: number = 0;

  @Input() updatedItem!: List;

  loading = false;
  listErrTxt!: string;


  errMsg = "";
  tp: List[] = []; // TODO const


  newItem: List[] = [];

  newItemTxt = '';

  pName: string = "Test";
  pUserId: string = this.sService.getUser() + "";
  pUserName: string = this.sService.userName;
  pDone: number = 1;
  pImg: string = ""; //infofix-test-banner-v5.png
  pCatId = "100";
  pPri = "4";
  pOrd = 0;
  pDesc: string = "";
  pFor: string = "";


  popular = '-1';
  status = '-1';
  tagsSel = '-1';
  regionsSel = '-1';



  pop: Select[] = [
    { value: '0', viewValue: 'Popular' },
    { value: '1', viewValue: 'Trending' },
    { value: '2', viewValue: 'Recent' }
  ];

  statusList: Select[] = [
    { value: '0', viewValue: 'In Progress' },
    { value: '1', viewValue: 'Done' },
    { value: '2', viewValue: 'Recent' }
  ];

  constructor(private router: Router,
    private sService: SharedService,
    private listService: ListService,
    appRef: ApplicationRef, updates: SwUpdate) {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(22 * 60 * 60 * 10000); //22h -- ?
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());


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
    this.getList();
  }

  setFilter(id: number, val: string): void {
    if (id === 0) {
      this.popular = val;
      this.getList();
    }
    else if (id === 1) {
      this.status = val;
      this.getList();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  setPage(i: number) {
    this.selPage = i;
    if (this.list) {
      this.list = this.list.filter(p => (p.done.toString() === this.selPage.toString()));
    }
    this.getList();

    switch (this.selPage) {
      case 0: {
        this.headerTxt = "V ZALOGI"
        break;
      }
      case 1: {
        this.headerTxt = "ZA NABAVO"
        break;
      }
      case 2: {
        this.headerTxt = "SMETI"
        break;
      }
    }
  }

  logout(): void {
    localStorage.clear();
    this.access = false;
    this.accessMsg = 'Ponovno se prijavite:';
  }

  loginDev() {
    this.role = parseInt(this.role + "");

    if (this.role === 52112 || this.role === 27695 || this.role === 90091
      || this.role === 60316 || this.role === 21554 || this.role === 21551 || this.role === 52313
      || this.role === 187) {

      if (this.uName === "Alen" || this.uName === "Ata" || this.uName === "Primož"
        || this.uName === "Tjaša" || this.uName === "Teo" || this.uName === "Rene") {

        this.accessMsg = 'Dobrodošli, ' + this.uName + '! . . .';
        this.setUser();
        setTimeout(() => {
          this.access = true;
          localStorage.setItem('acs', this.access + "");
        }, 900);
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

  trackByFn(i: number) {
    return i
  }

  getList(): void { // GET ALL ITEMS
    this.loading = true;
    this.listErrTxt = '';

    var tempP: List[];

    this.listService.getAll()
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Error!'));
        }),
        take(1),
        timeout(2500),
        catchError(this.handleError<List>('getAll'))
      )
      .subscribe({
        next: (v) => {
          tempP = v.projects
          this.list = [];
          //console.log('Get List:', v);
        },
        error: (error) => {
          this.listErrTxt = this.errMsg;
          this.loading = false;
          console.error('Error Loading Items!', error);
        },
        complete: () => {

          this.list = tempP; // TODO ?
          var tempList = this.list

          const userFilter = tempList.filter(p => p.user_id === this.sService.getUser() + "");

          tempList = userFilter.filter(p => (p.done.toString() === this.selPage.toString()));

          if (this.status !== '-1') { // CATEGORY ID FILTER
            tempList = tempList.filter(p => p.category_id === this.status);
          }
          if (this.tagsSel !== '-1') { // FOR TAG ID FILTER
            tempList = tempList.filter(p => p.for_id === this.tagsSel);
          }

          if (this.isChecked) {
            tempList = tempList.sort((b, a) => a.id.toString().localeCompare(b.id.toString()));
            tempList = tempList.sort((b, a) => a.pri.toString().localeCompare(b.pri.toString()));
            //this.list.sort((b, a) => a.ord.toString().localeCompare(b.ord.toString())); TODO: Sort by order number, not priority
          }

          this.list = tempList;

          this.loading = false;
          //console.log('Get All Items Complete!');
        }
      });
  }

  updateOn = false;
  tmpEditItem!: List;
  editItemId = 0;
  select(i : number) {
    this.editItemId = i;

    const tmpItemClone = JSON.parse(JSON.stringify(this.list[i]));
    
    const tmpEditClone = JSON.parse(JSON.stringify(this.list[i]));
    

    //const tmpItemClone: List;
    //this.list.forEach((val: List) => tmpItemClone.push(Object.assign({}, val)));

    //const tmpItemClone: List  = Object.assign([], this.list[i]);
    //const tmpEditClone: List  = Object.assign([], this.list[i]);

    this.updatedItem = tmpEditClone;
    this.tmpEditItem = tmpItemClone;

    this.updateOn = true;
  }
  
  cancelEdit() {
    //this.updatedItem = this.tmpEditItem;
    this.updateOn = false;
  }

  update(): void { // UPDATE ITEM   
    this.listService.updateItem(this.updatedItem) // TODO: Retry
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Error!'));
        }),
        take(1),
        timeout(2500),
        catchError(this.handleError<List>('updateItem'))
      )
      .subscribe({
        error: (error) => {
          console.error('Error updating item!', error);
          //this.newItemTxt = "Error! " + err;
        },
        complete: () => {
          //console.log("UP ITM", this.updatedItem)
          this.list[this.editItemId] = this.updatedItem;
          this.updateOn=false;
          //this.list.splice(i, 1);
          //delete this.list[i];
          //console.log('Items Moved!', i, tmp);
        }
      });
  }


  save(i: number): void { // MOVE ITEM - Za nabavo <> V zalogi 
    const tmp: List = this.list[i];
    switch (this.selPage) {
      case 0: { // stran nabava
        tmp.done = 1;
        break;
      }
      case 1: { // stran zaloga
        tmp.done = 0;
        break;
      }
      case 2: { // stran smeti
        tmp.done = 1;
        break;
      }
    }

    this.listService.updateItem(tmp) // TODO: Retry
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Error!'));
        }),
        take(1),
        timeout(2500),
        catchError(this.handleError<List>('updateItem'))
      )
      .subscribe({
        error: (error) => {
          console.error('Error trashing item!', error);
          //this.newItemTxt = "Error! " + err;
        },
        complete: () => {
          this.list.splice(i, 1);
          //delete this.list[i];
          //console.log('Items Moved!', i, tmp);
        }
      });
  }

  trash(i: number): void { // TRASH ITEM
    this.selItem = this.list[i];
    this.selItem.done = 2;
    this.listService.updateItem(this.selItem)
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Error!'));
        }),
        take(1),
        timeout(2500),
        catchError(this.handleError<List>('updateItem/trash'))
      )
      .subscribe({
        error: (error) => {
          console.error('Error trashing item!', error);
          //this.newItemTxt = "Error! " + err;
        },
        complete: () => {

          this.list.splice(i, 1);

          //console.log('Items Trashed!', i, this.selItem);
        }
      });
  }

  add(): void { // ADD ITEM
    const name = this.pName.trim();
    const user_id = this.pUserId.toString();
    const done = this.pDone;
    const description = this.pDesc.trim();
    const pri = Number(this.pPri);
    const ord = this.pOrd;
    const category_id = this.pCatId.toString();
    const img = this.pImg.toString();
    const for_id = this.pFor.trim();

    let customObj = new List();
    customObj.name = name;
    customObj.user_id = user_id;
    customObj.done = done;
    customObj.description = description;
    customObj.category_id = category_id;
    customObj.img = img;
    customObj.pri = pri;
    customObj.ord = ord;
    customObj.for_id = for_id;

    if (!name) { return; }
    this.listService.addItem({ name, user_id, done, description, category_id, img, pri, ord, for_id } as any)

      .pipe(
        catchError(() => {
          return throwError(() => new Error('Error!'));
        }),
        take(1),
        timeout(2500),
        catchError(this.handleError<any>('add'))
      )
      .subscribe({
        error: (error) => {
          console.error('Error adding item!');
          this.newItemTxt = "Error! " + error;
        },
        complete: () => {
          //this.list.push(customObj);


          this.loading = true;
          this.listErrTxt = '';

          this.listService.getAll()
            .pipe(
              catchError(() => {
                return throwError(() => new Error('Error!'));
              }),
              take(1),
              timeout(2500),
              catchError(this.handleError<List>('getAll'))
            )
            .subscribe({
              next: (v) => {
                this.tp = v.projects
                //console.log('Get List:', v);
              },
              error: (error) => {
                this.listErrTxt = this.errMsg;
                this.loading = false;
                console.error('Error Loading Items!', error);
              },
              complete: () => {
                this.list = this.tp;
                const userFilter = this.list.filter(p => p.user_id === this.sService.getUser() + "");
                this.list = userFilter;

                const doneFilter = this.list.filter(p => (p.done.toString() === this.selPage.toString()));
                this.list = doneFilter;

                if (this.isChecked) {
                  this.list.sort((b, a) => a.id.toString().localeCompare(b.id.toString()));
                  this.list.sort((b, a) => a.pri.toString().localeCompare(b.pri.toString()));
                  //this.list.sort((b, a) => a.ord.toString().localeCompare(b.ord.toString())); TODO: Sort by order number, not priority
                }

                this.loading = false;
                //console.log('Get All Items Complete!');
              }
            });


          // Clear inputs
          this.pName = "";
          this.pDesc = "";

          this.newItemTxt = 'Predmet dodan!';
          //console.log('Predmet uspešno dodan!');
          //this.getList();
        }
      }
      );
  }




  scrollToTop() {
    (function smoothscroll() {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 4));
        }
    })();
}


  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.name === "TimeoutError" || error.status === 403) {
        console.error('Handling error 401 or 403...', error);
      }
      this.errMsg = "Error!"
      // TODO: better handling
      console.error(`Error: ${error.message}`,
        '...handling...', error, operation, error.statusText);
      return error(result as T);
    };
  }
}
