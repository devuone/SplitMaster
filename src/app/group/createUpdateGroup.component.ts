import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }  from 'app/shared/service/data.service';
import { ToastService }  from 'app/shared/toast.service';

@Component({
  selector: 'sb-add-update-group',
  templateUrl: './createUpdateGroup.template.html'
})
export class CreateUpdateGroup {
  groupList = [];
  membersList = [];
  existingMembersList = [];
  groupName = "";
  newMember = "";
  groupId;
  isUpdate = false;
  headerData;
  constructor(
    private dataService : DataService,
    private router : Router,
    private route: ActivatedRoute,
  private toastService : ToastService
    ){};
  
  ngOnInit() {
  let existingMembers;
  this.route.params
    .subscribe((params) => {
      this.groupId = params['groupId'];
      if(this.groupId){
        this.isUpdate = true;
        this.groupName = this.dataService.getGroupName(this.groupId);
        existingMembers = this.dataService.getMembersOfGroup(this.groupId);
        existingMembers = this.dataService.getSafeToDeleteMembers(existingMembers,this.groupId);
        Object.keys(existingMembers).forEach((memberKey)=>{
          this.existingMembersList.push({id:existingMembers[memberKey].id,name:existingMembers[memberKey].name.value,isSafeToDelete:existingMembers[memberKey].isSafeToDelete});
        });
        this.headerData = {"title": this.groupName,"editButton": false};
      }
      else{
           this.headerData = {"editButton": false};
      }
      
    });
  };
  
  addGroup(){
    let groupId;
    if(this.groupName !== ""){
    groupId = this.dataService.createGroup(this.groupName);
    this.membersList.forEach((userName)=>{
      this.dataService.createUser(userName.name,groupId);
    });
    
     this.toastService.toast(`Group ' ${this.groupName} ' is created`);
     this.router.navigate(['/groups']);
  }
  else{
    this.toastService.toast(`Please provide a Group name`);
  }
  };
  
  updateGroup(){
    if(this.groupName !== ""){
    this.dataService.updateGroup(this.groupName,this.groupId);
    this.existingMembersList.forEach((user)=>{
      this.dataService.updateUserName(user.name,user.id,this.groupId);
    });
    this.membersList.forEach((user)=>{
      this.dataService.createUser(user.name,this.groupId);
    });
    this.toastService.toast(`Group ' ${this.groupName} ' is updated`);
    this.router.navigate(['/groups']);
    }
    else{
      this.toastService.toast(`Please provide a Group name`);
    }
  };

  deleteGroup(){
    this.dataService.deleteGroup(this.groupId);
    this.toastService.toast(`Group ' ${this.groupName} ' deleted`);
    this.router.navigate(['/groups']);
  };
  
  addMember(){
    if(this.newMember != "")
    this.membersList.push({name:this.newMember});
    this.newMember = "";
  };
  
  removeExistingMember(pmember,isSafeToDelete){
    if(!isSafeToDelete)
    this.toastService.toast(`${pmember} is involved in some expenses, cannot delete`);
    else
    this.existingMembersList = this.existingMembersList.filter((imember)=>imember.name!=pmember);
  };
  
  removeMember(pmember){
    this.membersList = this.membersList.filter((imember)=>imember.name!=pmember);
  };
}
