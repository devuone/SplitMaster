import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DataService }  from 'app/shared/service/data.service';
import { BalanceService }  from 'app/shared/service/balance.service';

@Component({
  selector: 'expense-list',
  templateUrl: './expenseList.template.html'
})
export class ExpenseList {
  expenseList = [];
  groupId;
  headerData;
  isExpenseListEmpty=true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService : DataService,
    private balanceService : BalanceService
    ){};
  
  ngOnInit() {
  this.route.params
    .subscribe((params) =>{
      this.groupId = params['groupId'];
      this.expenseList = this.dataService.getExpenseList(this.groupId);
      this.isExpenseListEmpty = Object.keys(this.expenseList).length === 0;
      this.headerData = {"title": this.dataService.getGroupName(this.groupId)};
    });
  };
  
  addExpense(){
    this.router.navigate(['./createExpense'], { relativeTo: this.route });
  };
  
  getStats(){
    this.router.navigate(['./statistics'], { relativeTo: this.route });
  };
  
  getBalanceTransactions(){
    this.router.navigate(['./balance'], { relativeTo: this.route });
  };
  
  editGroup(){
    this.router.navigate(['/updateGroup',this.groupId]);
  };
  
}

