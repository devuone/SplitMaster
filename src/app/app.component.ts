import { Component } from '@angular/core';
import { ToastService }  from './shared/toast.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.template.html',
  styles: ['div{background-color:#fcf8e3;}']
})
export class AppComponent {
  title = 'Angular 2 Template';
  showToast=false;
  toastText="";
  
  constructor(
  private toastService : ToastService){
    toastService.changeEmitted$.subscribe(
        text => {
            this.showToast = false
            this.toast(text);
        });
  };
  
  toast(text) {
    // Get the snackbar DIV
    this.showToast = true;
    this.toastText = text;
    // After 3 seconds, remove the show class from DIV
    setTimeout(()=>{this.showToast = false; this.toastText = ""; }, 5000);
 }
  
}
