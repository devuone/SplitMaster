import { Injectable } from '@angular/core';
import { DataService }  from 'app/shared/service/data.service';
import { MOCK_DATA } from  'app/shared/data-store';

@Injectable()
export class BalanceService{
  
  members;
  paidBy;
  sharedBy;
  willPay;
  willRecieve;
  transactions;
  constructor(private dataService : DataService){};
  
  getBalanceTransactions(groupId){
  this.members={};
  this.paidBy={};
  this.sharedBy={};
  this.willPay=[];
  this.willRecieve=[];
  this.transactions=[];
  
  let expenseList = this.dataService.getExpenseList(groupId);
  Object.keys(expenseList).forEach((key)=>{
    let expense = expenseList[key];
    let userId = expense.paidBy[0].user.id;
    if(this.paidBy[userId]){
      this.paidBy[userId].amount += +expense.paidBy[0].amount;
    }
    else{
      this.paidBy[userId] = {name:expense.paidBy[0].user.name.value,amount:+expense.paidBy[0].amount};
    }
    
    expense.sharedBy.forEach((sharedExpense)=>{
      let userId = sharedExpense.user.id;
      if(this.sharedBy[userId]){
        this.sharedBy[userId].amount += +sharedExpense.amount;
      }
      else{
        this.sharedBy[userId] = {name:sharedExpense.user.name,amount:+sharedExpense.amount};
      }
    });
  });
  
  this.members = this.dataService.getMembersOfGroup(groupId);
  Object.keys(this.members).forEach((userId)=>{
    let paidAmt = this.paidBy[userId]?this.paidBy[userId].amount:0;
    let sharedAmt = this.sharedBy[userId]?this.sharedBy[userId].amount:0;
    if(paidAmt  > sharedAmt){
     this.willRecieve.push({user:this.members[userId],amount:(paidAmt - sharedAmt)});
     }
    else if(sharedAmt > paidAmt){
     this.willPay.push({user:this.members[userId],amount:(sharedAmt - paidAmt)});
    }
  });
  
  let willRecieveSize =this.willRecieve.length;
  let willPaySize = this.willPay.length;
  
  for(let i=0,j=0 ; i< willRecieveSize || j < willPaySize ; null){
    if(this.willPay[j].amount > this.willRecieve[i].amount){
      let amount = this.willRecieve[i].amount;
      this.willPay[j].amount -= amount;
      this.willRecieve[i].amount -= amount;
      this.transactions.push({payer:this.willPay[j].user,reciever:this.willRecieve[i].user,amount:amount});
      
    }
    else{
      let amount = this.willPay[j].amount;
      this.willPay[j].amount -= amount;
      this.willRecieve[i].amount -= amount;
      this.transactions.push({payer:this.willPay[j].user,reciever:this.willRecieve[i].user,amount:amount});
      
    }
    
    if(this.willPay[j].amount === 0){
        j++;
      }
    if(this.willRecieve[i].amount === 0){
        i++;
      }
  }
   
  return  {transactions:this.dataService.resolveRefrences(this.transactions),sharedBy:this.sharedBy,paidBy:this.paidBy};
  };
  
}