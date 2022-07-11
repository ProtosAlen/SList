import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/_interfaces/list';
import { ListService } from 'src/app/_services/list.service';
import { SharedService } from 'src/app/_services/shared.service';
import { ActiveComponent } from '../active/active.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  projects: List[] = [];

  status: any;

  pName: string = "Test";
  pUserId: string = this.sService.getUser() + "";
  pUserName: string = this.sService.userName;
  pDone: string = "0";
  pImg: string = "infofix-test-banner-v5.png";
  pCatId = 0;
  pDesc: string = "";



  constructor(private listService: ListService,
    private sService: SharedService) { }

  ngOnInit() {

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
    const description = this.pDesc.trim();
    const category_id = this.pCatId.toString();
    const img = this.pImg.toString();

    let customObj = new List();
    customObj.name = name;
    customObj.user_id = user_id;
    customObj.done = done;
    customObj.description = description;
    customObj.category_id = category_id;
    customObj.img = img;
    //this.pUserId = "";
    //this.pImg = "tes.png"; 



    //if (!name) { return; }
    //console.log(this.projects[0])
    //this.listService.addProject(this.projects[0]);


    
    if (!name) { return; }
    this.listService.addProject({ name, user_id, done, description, category_id, img} as any)
      .subscribe(project => {

        this.projects.push(customObj);
        //console.log(this.projects);
        //this.projects.push(project);

        this.status = 'Predmet dodan!';

        console.log(project);
        console.log( this.status);

      });
  }

}
