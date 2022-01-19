import { Component, Input, OnInit } from '@angular/core';
import { List } from 'src/app/_interfaces/list';
import { AppService } from 'src/app/_services/app.service';
import { ListService } from 'src/app/_services/list.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['../active/active.component.scss']
})
export class ArchiveComponent implements OnInit {

  list!: List[];

  loading = false;
  errorMessage = "";

  constructor(private listService: ListService, private appService: AppService) {}



  ngOnInit() {
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

          const doneFilter = this.list.filter(p => p.done === '1');
          this.list = doneFilter;

          const userFilter = this.list.filter(p => p.user_id === this.appService.getUser());
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
