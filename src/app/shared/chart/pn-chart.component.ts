import { Component, Input } from '@angular/core';

@Component({
  selector: 'pn-chart',
  templateUrl: './pn-chart.template.html'
})
export class PNChartComponent {
  @Input() chartData;
  
  ngOnInit() {
    let total=0;
    let positivePerc=0;
    let negativePerc=0;
    this.chartData = this.chartData.map((item)=>{
      total = item.positive + item.negative;
      positivePerc=Math.round(item.positive/total*100);
       negativePerc=Math.round(item.negative/total*100);
       return {
         label:item.label,
         positiveLabel:item.positiveLabel,
         negativeLabel:item.negativeLabel,
         positiveValue:item.positive,
         negativeValue:item.negative,
         positivePerc:positivePerc,
         negativePerc:negativePerc
       };
       
    });
  };
  
}
