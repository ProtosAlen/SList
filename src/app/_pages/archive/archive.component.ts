import { Component, Input, OnInit } from '@angular/core';
import { List } from 'src/app/_interfaces/list';
import { ListService } from 'src/app/_services/list.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['../active/active.component.scss']
})
export class ArchiveComponent implements OnInit {

  list: List[] = [];

  loading = false;
  errorMessage = "";

  selItem!: List;

  small: boolean = false;

  constructor(private listService: ListService, private sService: SharedService) { }



  ngOnInit() {
    this.getList();
  }

  trackByFn(i: number) {
    return i
  }

  save(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = "0";

    this.list.splice(i, 1);

    this.listService.updateProj(this.selItem)
      .subscribe();
  }

  tst = 0; // TODO: Change class on item priority

  // REMOVE ITEM
  remove(i: number): void {
    this.listService.deleteProject(this.list[i])
      .subscribe(
        (response) => {                           // next() callback
          //console.log('Item Removed', i);
          this.list.splice(i, 1);
          //this.getList();
        },
      );
  }


  getList(): void {

    this.loading = true;
    this.errorMessage = '';
    this.listService.getProjs()
      .subscribe(
        (response) => {                           // next() callback
          console.log('Projects Loaded');
          this.list = response.projects;

          const doneFilter = this.list.filter(p => p.done === '1');
          this.list = doneFilter;

          const userFilter = this.list.filter(p => p.user_id === this.sService.getUser() + "");
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

