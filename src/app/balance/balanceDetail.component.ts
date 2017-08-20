import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BalanceService }  from 'app/shared/service/balance.service';
import { DataService }  from 'app/shared/service/data.service';

@Component({
  selector: 'balance-list',
  templateUrl: './balanceDetail.template.html'
})
export class BalanceDetail {
  transactionsList = [];
  groupId;
  headerData;
  constructor(
    private route: ActivatedRoute,
    private balanceService : BalanceService,
    private dataService: DataService,
    ){};
  
  ngOnInit() {
  this.route.params
    .subscribe((params) =>{
      this.groupId = params['groupId'];
    });
    
   this.transactionsList = this.balanceService.getBalanceTransactions(this.groupId).transactions;
   this.headerData = {"title": this.dataService.getGroupName(this.groupId)};
  };
  
  
  
}

