import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { Trace } from 'client/app/_models/trace';

@Component({
  selector: 'ktb-delivery-analytics-details',
  templateUrl: './ktb-delivery-analytics-details.component.html',
  styleUrls: ['./ktb-delivery-analytics-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbDeliveryAnalyticsDetailsComponent {

  result: DeliveryAnalyticsResult | undefined;

  @Input()
  set event(event: Trace) {
    this.result = {
      ...event.data.deliveryAnalytics, // TODO: remove demo data
      parentResult: {
        service: event.getService(),
        mismatches: [
          {
            service: 'logging',
            type: MismatchType.Dependency,
            tagTested: '0.8.12',
          },
          {
            service: 'redis',
            type: MismatchType.Tag,
            tagTested: '0.1.2',
            tagTarget: '0.1.0',
          }
        ]
      }
    };
  }
}
