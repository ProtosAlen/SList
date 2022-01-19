import { List } from './../list';
import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @Input() list: List;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location
  ) {}

  ngOnInit(): void {
   this.getProject();
  }

  getProject(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(id)
    .subscribe(project => this.list = project);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.projectService.updateProject(this.list)
      .subscribe(() => this.goBack());
  }
}
