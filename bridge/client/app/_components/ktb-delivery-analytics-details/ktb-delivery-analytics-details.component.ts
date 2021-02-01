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
    this.result = event.data.deliveryAnalytics;
  }

  /**
   * No tested release-bracket
   */
  private getResultNoTestedRB(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.FAILED,
      service: 'checkout',
      tag: '0.5.1',
    };
  }

  private getResultParentsMissing(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.FAILED,
      service: 'checkout',
      tag: '0.5.1',
      dependencies: {
        parents: ['carts', 'cache', 'payment', 'product-catalog'],
        children: ['frontend'],
        edges: [
          { v: 'frontend', w: 'checkout' },
          { v: 'checkout', w: 'carts' },
          { v: 'checkout', w: 'payment' },
          { v: 'checkout', w: 'product-catalog' },
          { v: 'carts', w: 'cache' },
        ],
      },
      parentResult: [
        { service: 'payment', tagTested: '0.5.0', type: MismatchType.Dependency },
        { service: 'cache', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
      ],
      childResult: [],
    };
  }

  private getResultChildrenMissing(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.WARNING,
      service: 'cache',
      tag: '0.5.1',
      dependencies: {
        parents: [],
        children: ['carts', 'checkout', 'frontend'],
        edges: [
          { v: 'frontend', w: 'checkout' },
          { v: 'checkout', w: 'carts' },
          { v: 'carts', w: 'cache' },
        ],
      },
      parentResult: [],
      childResult: [
        { service: 'carts', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
        { service: 'frontend', tagTested: '0.5.0', type: MismatchType.Dependency },
      ],
    };
  }

  private getResultAllMissing(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.FAILED,
      service: 'carts',
      tag: '0.5.1',
      dependencies: {
        parents: ['cache'],
        children: ['checkout', 'frontend'],
        edges: [
          { v: 'frontend', w: 'checkout' },
          { v: 'checkout', w: 'carts' },
          { v: 'carts', w: 'cache' },
        ],
      },
      parentResult: [
        { service: 'cache', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
      ],
      childResult: [
        { service: 'frontend', tagTested: '0.5.0', type: MismatchType.Dependency },
      ],
    };
  }

  private getResultNoParentsAndChildren(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.PASSED,
      service: 'cache',
      tag: '0.5.1',
      dependencies: {
        parents: [],
        children: [],
        edges: [],
      },
      parentResult: [],
      childResult: [],
    };
  }

  private getResultAllOk(): DeliveryAnalyticsResult {
    return {
      result: ResultTypes.PASSED,
      service: 'carts',
      tag: '0.5.1',
      dependencies: {
        parents: ['cache'],
        children: ['checkout'],
        edges: [
          { v: 'checkout', w: 'carts' },
          { v: 'carts', w: 'cache' },
        ],
      },
      parentResult: [],
      childResult: [],
    };
  }
}
