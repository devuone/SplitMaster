import { Component } from '@angular/core';
import { DataService }  from 'app/shared/service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-groups-list',
  templateUrl: './groupList.template.html'
})
export class GroupList {
  groupList = [];
  groupName = "";
  headerData;
  className = false;
  constructor(private dataService : DataService,
  private router : Router){
    this.groupList = this.dataService.getGroupsList();
    this.headerData = {"backButton": false,"editButton":false};
  };
  
  addGroup(){
    if(this.groupName !== "")
    this.dataService.createGroup(this.groupName);
    this.groupList = this.dataService.getGroupsList();
  };
  
  createGroup() {
  this.router.navigate(['/createGroup']);
  };
  
}
