import { Component, Input, OnInit } from '@angular/core';

import { List } from 'src/app/_interfaces/list';
import { ListService } from 'src/app/_services/list.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  @Input() list: List[] = [];

  loading = false;
  errorMessage!: string;

  uID: string = this.sService.getUser() + "";

  selItem!: List;

  small: boolean = false;

  constructor(private listService: ListService, private sService: SharedService) { }

  ngOnInit() {
    this.getList();

  }

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

  // SAVE ITEM
  save(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = "1";

    this.list.splice(i, 1);

    this.listService.updateProj(this.selItem)
      .subscribe();
  }

  getList(): void {

    console.log(this.uID);

    this.loading = true;
    this.errorMessage = '';
    this.listService.getProjs()
      .subscribe(
        (response) => {                           // next() callback
          console.log('Projects Loaded');
          this.list = response.projects;

          const doneFilter = this.list.filter(p => p.done === '0');
          this.list = doneFilter;

          const userFilter = this.list.filter(p => p.user_id === this.uID);
          this.list = userFilter;
        },
        (error) => {                              // error() callback
          console.error('Error Loading Projects');
          this.errorMessage = error;
          this.loading = false;
        },
        () => {                                   // complete() callback
          this.loading = false;
        });
  }


}
