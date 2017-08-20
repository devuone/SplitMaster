import { Component, Input, Output, EventEmitter  } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'sb-header',
  templateUrl: './header.template.html'
})
export class HeaderComponent{
  
  @Input() headerData;
  @Output() editClick = new EventEmitter();

  navBarBrand;
  navBarText;
  showBackButton;
  showEditButton;
  
  constructor(private location: Location){};
  ngOnInit(){
    
    this.navBarBrand = this.headerData.title ? this.headerData.title : "SplitMaster";
    this.navBarText =  this.headerData.text ? this.headerData.text : "split group expenses easily";
    this.showBackButton = this.headerData.backButton!==undefined ? this.headerData.backButton : true;
    this.showEditButton = this.headerData.editButton!==undefined ? this.headerData.editButton : true;
  };
  
  editGroup(){
    this.editClick.emit();
  };
  
  goBack(): void {    
     this.location.back();
    }
  
}
