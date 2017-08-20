import { Injectable } from '@angular/core';
import { MOCK_DATA } from  'app/shared/data-store';

@Injectable()
export class DataService{
  
  mockData;
  
  constructor(){
   this.mockData =  MOCK_DATA;
  };
  
  getUniqueID(){
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
  };
  
  resolveRefrences(obj) {
   Object.keys(obj).forEach((key) =>{
       if (typeof obj[key] === 'object') {
            return this.resolveRefrences(obj[key]);
        }
        if(key === "type" && obj[key] === "ref"){
          var val = obj["value"];
          delete obj.type;
          obj["value"] = this.mockData.refrences[val];
          }
     
   });
    return obj;
 };
 
  getUserObject(groupId,userId){
    return this.mockData.groups[groupId].members[userId];
  };

  
  getGroupsList(){
    let obj = JSON.parse(JSON.stringify(this.mockData.groups));
    let groupsList = this.resolveRefrences(obj);
    return groupsList;
    
  };
  
  getGroupName(groupId){
    let obj = JSON.parse(JSON.stringify(this.mockData.groups[groupId]));
    let group = this.resolveRefrences(obj);
    return group.name.value;
  };
  
  getExpenseList(groupId){
    let obj = JSON.parse(JSON.stringify(this.mockData.groups[groupId].expenses));
    let expenseList = this.resolveRefrences(obj);
    return expenseList;
  };
  
  getExpenseDetail(groupId,expenseId){
    let expense = this.mockData.groups[groupId].expenses[expenseId];
    let obj = JSON.parse(JSON.stringify(expense));
    expense = this.resolveRefrences(obj);
    return expense;
  };
  
  getMembersOfGroup(groupId){
    let members = this.mockData.groups[groupId].members;
    let obj = JSON.parse(JSON.stringify(members));
    members = this.resolveRefrences(obj);
    return members;
  };
  
  getSafeToDeleteMembers(members,groupId){
    let expenseObj;
    Object.keys(members).forEach((userId)=>{
      members[userId]["isSafeToDelete"] = true;
      expenseObj = this.mockData.groups[groupId].expenses;
      Object.keys(expenseObj).forEach((key)=>{
        expenseObj[key].paidBy.forEach((sharedBy)=>{
          if(sharedBy.user.id === userId)
          members[userId]["isSafeToDelete"] = false;
        });
        expenseObj[key].sharedBy.forEach((sharedBy)=>{
          if(sharedBy.user.id === userId)
          members[userId]["isSafeToDelete"] = false;
        });
      });
    });
    return members;
  };
  
  createExpense(groupId,expenseData){
    let expenseId = this.getUniqueID();
    let expenseObj = {
      "id":expenseId,
      "amount":expenseData.amount,
      "for":expenseData.paidFor,
      "paidBy":[{"user":this.getUserObject(groupId,expenseData.paidBy),"amount":expenseData.amount}],
      "sharedBy":[]
    };
    expenseData.sharedBy.forEach((user)=>{
      expenseObj.sharedBy.push({"user":this.getUserObject(groupId,user.id),"amount":user.amount});
    });
    this.mockData.groups[groupId].expenses[expenseId] = expenseObj;
  };
  
  updateExpense(groupId,expenseId,expenseData){
    let expenseObj = {
      "id":expenseId,
      "amount":expenseData.amount,
      "for":expenseData.paidFor,
      "paidBy":[{"user":this.getUserObject(groupId,expenseData.paidBy),"amount":expenseData.amount}],
      "sharedBy":[]
    };
    expenseData.sharedBy.forEach((user)=>{
      expenseObj.sharedBy.push({"user":this.getUserObject(groupId,user.id),"amount":user.amount});
    });
    this.mockData.groups[groupId].expenses[expenseId] = expenseObj;
  };
  
  deleteExpense(groupId,expenseId,){
    delete this.mockData.groups[groupId].expenses[expenseId];
  }

  createGroup(groupName){
    let groupId = this.getUniqueID();
    let groupNameId = this.getUniqueID();
    let groupObj = {  
         "id":groupId,
         "name":{  
            "value":groupNameId,
            "type":"ref"
         }
      };
    this.mockData.groups[groupId] = groupObj;
    this.mockData.groups[groupId].members = {};
    this.mockData.groups[groupId].expenses = {};
    this.mockData.refrences[groupNameId] = groupName; 
    return groupId;
  };
  
  updateGroup(groupName,groupId){
    let groupNameId = this.mockData.groups[groupId].name.value;
    this.mockData.refrences[groupNameId] = groupName; 
  };

  deleteGroup(groupId){
    delete this.mockData.groups[groupId];
  };
  
  createUser(userName,groupId){
    let userId = this.getUniqueID();
    let userNameId = this.getUniqueID();
    let userObj = {  
         "id":userId,
         "name":{  
            "value":userNameId,
            "type":"ref"
         }
      };
    this.mockData.groups[groupId].members[userId] = userObj;
    this.mockData.refrences[userNameId] = userName; 
  };
  
  updateUserName(userName,userId,groupId){
    let userNameId = this.mockData.groups[groupId].members[userId].name.value;
    this.mockData.refrences[userNameId] = userName; 
  };
  
}