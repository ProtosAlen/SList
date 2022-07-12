import { Component, Input, OnInit } from '@angular/core';
import { List } from 'src/app/_interfaces/list';
import { ListService } from 'src/app/_services/list.service';
import { SharedService } from 'src/app/_services/shared.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['../active/active.component.scss']
})
export class ArchiveComponent implements OnInit {

  @Input() list: List[] = [];

  loading = false;
  errorMessage = "";

  selItem!: List;

  small: boolean = false;

  data = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });

  constructor(private listService: ListService, private sService: SharedService) { }



  ngOnInit() {
    this.getList();
  }

  trackByFn(i: number) {
    return i
  }

  save(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = 0;

    this.list.splice(i, 1);

    this.listService.updateProj(this.selItem)
      .subscribe();
  }

  trash(i: number): void {
    this.selItem = this.list[i];
    this.selItem.done = 2;

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

