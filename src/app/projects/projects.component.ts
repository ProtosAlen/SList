import { ListDoneFilter } from './../list-done-filter';
import { List } from './../list';
import { Component, OnInit, Input } from '@angular/core';

import { ProjectService } from '../project.service';
import { map } from 'rxjs/operators';

import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';


interface Regions {
  value: string;
  viewValue: string;
}

interface RegionsGroup {
  disabled?: boolean;
  name: string;
  region: Regions[];
}

interface Uploaded {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  status = 'all';

  listDoneFilterD: ListDoneFilter = { done: false };

  public searchText = '0';

  pop: Uploaded[] = [
    {value: 'ata-0', viewValue: 'Ata'},
    {value: 'mama-1', viewValue: 'Mama'},
    {value: 'alen-2', viewValue: 'Alen'}
  ];

  tags = new FormControl();
  tagsList: string[] = ['Programming', 'Visual Art', 'Music', 'Graphic Design'];

  selectedItem: List;

  selectedUser: List;

  public list: List[];

  name: string;

  loading = false;
  errorMessage;

  isChecked = true;
  formGroup: FormGroup;


mySubscription: any;

  constructor(private router: Router, private projectService: ProjectService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      inStock: ['', Validators.requiredTrue]
    });
  }

  inStockSubmit(item: List): void {
    this.projectService.updateProject(item)
        .subscribe();

        console.log('scope is', item);

        this.getProjs();

  }

  onFormSubmit() {
    alert(JSON.stringify(this.formGroup.value, null, 2));
  }

  ngOnInit(): void {
    this.getProjs();
  }

  getProjs(): void {

    this.loading = true;
    this.errorMessage = '';
    this.projectService.getProjs()
      .subscribe(
        (response) => {                           // next()
          console.log('Response received');
          this.list = response.projects;
        },
        (error) => {                              // error()
          console.error('Request failed with error');
          this.errorMessage = error;
          this.loading = false;
        });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.projectService.addProject({ name } as List)
      .subscribe(project => {
        this.list.push(project);
      });
  }

  delete(list: List): void {
    this.list = this.list.filter(h => h !== list);
    this.projectService.deleteProject(list).subscribe();
  }
}
