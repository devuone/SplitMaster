import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DataService }  from 'app/shared/service/data.service';
import { ToastService }  from 'app/shared/toast.service';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'sb-add-update-group',
  templateUrl: './createUpdateExpense.template.html'
})
export class CreateUpdateExpense {
  groupId;
  expenseId;
  expense;
  membersList;
  sharedAmount = 0;
  isUpdate = false;
  headerData;
  
  expenseForm = this.formBuilder.group({
      amount: '0',
      paidFor: '',
      paidBy: '',
      sharedBy:this.formBuilder.array([])
    });
  
  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private dataService: DataService,
  private toastService : ToastService,
  private formBuilder: FormBuilder
  ) {};
  
  get sharedBy(): FormArray {
    return this.expenseForm.get('sharedBy') as FormArray;
  };
  
  ngOnInit() {
  this.route.params
    .subscribe((params) => {
      this.groupId = params['groupId'];
      this.membersList = this.dataService.getMembersOfGroup(this.groupId);
      this.expenseId = params['expenseId'];
      this.headerData = {"title": this.dataService.getGroupName(this.groupId)};
    });
    
    const sharedByArray = this.expenseForm.get('sharedBy') as FormArray;
    for (let member of Object.keys(this.membersList)) {
      sharedByArray.push(this.createSharedBy(this.membersList[member].name.value,this.membersList[member].id));
    };
    
    if(this.expenseId){
         this.expense = this.dataService.getExpenseDetail(this.groupId,this.expenseId);
      }
    if(this.expenseId){
      this.expenseForm.controls['amount'].setValue(this.expense.amount);
      this.expenseForm.controls['paidFor'].setValue(this.expense['for']);
      this.expenseForm.controls['paidBy'].setValue(this.expense.paidBy[0].user.id);
      (this.expenseForm.get('sharedBy')['controls']).forEach((item) => {
        item.controls['isChosen'].setValue(false,{ emitEvent: false });
        this.expense.sharedBy.forEach((shareditem)=>{
          if(shareditem.user.id === item.controls.id.value){
            item.controls['amount'].setValue(shareditem.amount,{ emitEvent: false });
            item.controls['name'].setValue(shareditem.user.name.value,{ emitEvent: false });
            item.controls['isChosen'].setValue(true,{ emitEvent: false });
          }
        });
         
      });
    }
    
    this.expenseForm.valueChanges.subscribe(data => {
      this.updateSharedAmount();
    });
    
  };
  
  createSharedBy(name,id) {
    return this.formBuilder.group({
      isChosen: true,
      name: name,
      id: id,
      amount: 0
    });
  };
  
  updateSharedAmount(){
    let sharedAmount = this.getSharedAmount();
    (this.expenseForm.get('sharedBy')['controls']).forEach((item) => {
     if(item.controls.isChosen.value) 
     {
       item.controls['amount'].setValue(sharedAmount,{ emitEvent: false });
     }
     else{
       item.controls['amount'].setValue(0,{ emitEvent: false });
     }
     });
  };
  
  getSharedAmount(){
   let amount = this.expenseForm.controls['amount'].value;
   let sharingMembers =  this.expenseForm.value;
   let selectedMembers = sharingMembers.sharedBy.filter(x => x.isChosen).map(x => { return { name: x.name, id: x.id }; });
   let userCount = selectedMembers.length;
   return +amount/userCount;
  }
  
  addExpense(){
    this.dataService.createExpense(this.groupId,this.expenseForm.value);
    this.toastService.toast(`Expense added`);
    this.router.navigate(['/groups',this.groupId,'expenses']);
  };
  
  updateExpense(){
     this.dataService.updateExpense(this.groupId,this.expenseId,this.expenseForm.value);
     this.toastService.toast(`Expense updated`);
     this.router.navigate(['/groups',this.groupId,'expenses']);
  };

  deleteExpense(){
    this.toastService.toast(`Expense deleted`);
    this.dataService.deleteExpense(this.groupId,this.expenseId);
    this.router.navigate(['/groups',this.groupId,'expenses']);
  };
}
