import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { ResultTypes } from 'client/app/_models/result-types';
import { Trace } from 'client/app/_models/trace';

@Component({
  selector: 'ktb-delivery-analytics-details',
  templateUrl: './ktb-delivery-analytics-details.component.html',
  styleUrls: ['./ktb-delivery-analytics-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbDeliveryAnalyticsDetailsComponent {

  readonly EVENT_PASSED = ResultTypes.PASSED;
  readonly EVENT_FAILED = ResultTypes.FAILED;
  readonly EVENT_WARNING = ResultTypes.WARNING;

  result: DeliveryAnalyticsResult | undefined;

  @Input()
  set event(event: Trace) {
    this.result = {
      result: ResultTypes.FAILED,
      service: 'carts',
      tag: '0.1.3',
      dependencies: {
        nodes: ['checkout', 'frontend', 'carts', 'cache', 'logging', 'persistance'],
        edges: [
          { v: 'frontend', w: 'checkout' },
          { v: 'checkout', w: 'carts' },
          { v: 'carts', w: 'cache' },
          { v: 'cache', w: 'logging' },
          { v: 'cache', w: 'persistance' },
        ]
      },
      parentResult: [
        { service: 'logging', tagTested: '0.1.1', type: MismatchType.Dependency },
        { service: 'cache', tagTested: '0.4.3', tagTarget: '0.3.1', type: MismatchType.Tag },
      ],
      childResult: [
        { service: 'frontend', tagTested: '0.5.0', tagTarget: '0.4.9', type: MismatchType.Tag },
      ],
    };
  }
}
