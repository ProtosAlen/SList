import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/_interfaces/list';
import { ListService } from 'src/app/_services/list.service';
import { SharedService } from 'src/app/_services/shared.service';
import { ActiveComponent } from '../active/active.component';

@Component({
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  projects: any[] = [];

  status: any;

  pName: string = "";
  pUserId: string = "";
  pUserName: string = "";
  pDone: string = "0";

  constructor(private listService: ListService, 
    private sService: SharedService,
    private aL: ActiveComponent) { }

  ngOnInit() {
    this.pUserId = this.sService.userID;
    this.pUserName = this.sService.userName;

    /*
    this.pTeamId = '0';
    this.pTeamName = 'Test Team';
    this.pImage = 'infofix-test-banner-v5.png';
    this.pLikes = '1';
    */
  }

  add(): void {
    const name = this.pName.trim();
    const user_id = this.pUserId.toString();
    const done = this.pDone.trim();

    if (!name) { return; }
    this.listService.addProject({ name, user_id, done } as List)
      .subscribe(project => {
        console.log(this.projects);
        this.projects.push(project);

        this.status = 'Item Created!';

        console.log(project);
        console.log( this.status);

        this.aL.getList();

      });
  }
}
