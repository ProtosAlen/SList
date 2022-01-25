import { Component, Input, OnInit } from '@angular/core';

import { List } from 'src/app/_interfaces/list';
import { AppService } from 'src/app/_services/app.service';
import { ListService } from 'src/app/_services/list.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  @Input() list: List[] = [];

  loading = false;
  errorMessage!: string;

  uID: string = this.appService.getUser();

  selItem!: List;



  constructor(private listService: ListService, private appService: AppService) {}

  ngOnInit() {
    this.getList();

  }

  save(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = "1";

    this.listService.updateProj(this.selItem)
      .subscribe();

    this.getList();
  }

  getList(): void {

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
