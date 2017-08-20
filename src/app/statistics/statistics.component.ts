import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BalanceService }  from 'app/shared/service/balance.service';
import { DataService }  from 'app/shared/service/data.service';

@Component({
  selector: 'statistics',
  templateUrl: './statistics.template.html'
})
export class Statistics {
  transactionsList = [];
  sharedBy;
  paidBy;
  groupId;
  shareByData=[];
  paidByData=[];
  creditDebitData=[];
  headerData;
  
  constructor(
    private route: ActivatedRoute,
    private balanceService : BalanceService,
    private dataService: DataService,
    ){};
  
  ngOnInit() {
  let balanceObj;
  let memberslist;
  this.route.params
    .subscribe((params) =>{
      this.groupId = params['groupId'];
      this.createComponentData();
    });
  };
  
  createComponentData(){
    let balanceObj;
  let memberslist;
  
    balanceObj = this.balanceService.getBalanceTransactions(this.groupId);
   memberslist = this.dataService.getMembersOfGroup(this.groupId);
   
   this.sharedBy = balanceObj.sharedBy;
   this.paidBy = balanceObj.paidBy;
   
   Object.keys(this.sharedBy).forEach((key)=>{
        this.shareByData.push({label:this.sharedBy[key].name.value,value:this.sharedBy[key].amount});
      });
   Object.keys(this.paidBy).forEach((key)=>{
    this.paidByData.push({label:this.paidBy[key].name,value:this.paidBy[key].amount});
  });
  Object.keys(memberslist).forEach((userId)=>{
    let userName = memberslist[userId].name.value;
    let totalAmount = 0;
    let sharedAmount = 0;
    let paidAmount = 0;
    if(this.sharedBy[userId]){
      totalAmount += this.sharedBy[userId].amount;
      sharedAmount = this.sharedBy[userId].amount;
    }
    if(this.paidBy[userId]){
      totalAmount += this.paidBy[userId].amount;
      paidAmount = this.paidBy[userId].amount;
    }
    if(totalAmount >0 ){
      this.creditDebitData.push({label:userName,positive:paidAmount,positiveLabel:"credit",negative:sharedAmount,negativeLabel:"debit"});
    }
    
  });
  this.headerData = {"title": this.dataService.getGroupName(this.groupId)};
    
  };
  
  
  
}

