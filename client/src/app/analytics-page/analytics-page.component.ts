import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage, IConfig } from '../shared/interfaces';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef!: ElementRef;
  @ViewChild('order') orderRef!: ElementRef;

  aSub: Subscription | undefined;
  average: number | undefined;
  pending = true;

  constructor(private service: AnalyticsService) {}

  ngAfterViewInit() {
    const gainConfig: IConfig = {
      label: 'Revenue',
      color: '#ff1744 ',
      labels: [],
      data: []
    };

    const orderConfig: IConfig = {
      label: 'Orders',
      color: '#76ff03 ',
      labels: [],
      data: []
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map((item) => item.label);
      gainConfig.data = data.chart.map((item) => item.gain);

      orderConfig.labels = data.chart.map((item) => item.label);
      orderConfig.data = data.chart.map((item) => item.order);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
      new Chart(gainCtx, createChartConfig(gainConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig(config: IConfig): ChartConfiguration<'line'> {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels: config.labels,
      datasets: [
        {
          label: config.label,
          data: config.data,
          borderColor: config.color,
          stepped: false,
          fill: false
        }
      ]
    }
  };
}

