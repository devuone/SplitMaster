import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder }   from '@angular/forms'; // <-- NgModel lives here
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { HeaderComponent }  from './header/header.component';
import { GroupList }  from './group/groupList.component';
import { CreateUpdateGroup }  from './group/createUpdateGroup.component';
import { DataService }  from './shared/service/data.service';
import { BalanceService }  from './shared/service/balance.service';
import { ToastService }  from './shared/toast.service';
import { ExpenseList }  from './expense/expenseList.component';
import { BalanceDetail }  from './balance/balanceDetail.component';
import { CreateUpdateExpense }  from './expense/createUpdateExpense.component';
import { KeysPipe }  from './shared/pipe/keys.pipe';
import { PieChartComponent }  from './shared/chart/pie-chart.component';
import { Statistics } from "./statistics/statistics.component";
import { PNChartComponent } from './shared/chart/pn-chart.component';

const appRoutes: Routes = [
  {
   path:'groups',
   children:[
      
               {
                  path:'',
                  component:GroupList
               },
               {
                  path:':groupId/expenses',
                   children:[
                              {
                                 path:'',
                                 component:ExpenseList
                              },
                              {
                                 path:'balance',
                                 component:BalanceDetail
                              },
                              {
                                 path:'statistics',
                                 component:Statistics
                              },
                              {
                                 path:'updateExpense/:expenseId',
                                 component:CreateUpdateExpense
                              },
                              {
                                 path:'createExpense',
                                 component:CreateUpdateExpense
                              }
                            ]
                }
   ]
},
{
   path:'createGroup',
   component:CreateUpdateGroup
},
{
   path:'updateGroup/:groupId',
   component:CreateUpdateGroup
},
{
   path:'',
   redirectTo:'/groups',
   pathMatch:'full'
},
{
   path:'*',
   redirectTo:'/groups',
   pathMatch:'full'
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    GroupList,
    CreateUpdateGroup,
    ExpenseList,
    BalanceDetail,
    CreateUpdateExpense,
    KeysPipe,
    PieChartComponent,
    PNChartComponent,
    Statistics
  ],
  providers:[DataService,BalanceService,ToastService, FormBuilder],
  bootstrap: [ AppComponent ]
})
export class AppModule { }