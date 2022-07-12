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

  uID: string = this.sService.getUser().toString();

  selItem!: List;

  small: boolean = false;

  done: number = 0;

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

          const doneFilter = this.list.filter(p => p.done === 1);
          this.list = doneFilter;

          const userFilter = this.list.filter(p => p.user_id === this.sService.getUser() + "");
          this.list = userFilter;

          this.list.sort((b, a) => a.id.toString().localeCompare(b.id.toString()));
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
