import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsStatus, DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { ResultTypes } from 'client/app/_models/result-types';
import { Trace } from 'client/app/_models/trace';

const STATUS_WITH_DEPENDENCIES = [AnalyticsStatus.Ok, AnalyticsStatus.Mismatch, AnalyticsStatus.NotTested];

@Component({
  selector: 'ktb-delivery-analytics-details',
  templateUrl: './ktb-delivery-analytics-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbDeliveryAnalyticsDetailsComponent {

  result: DeliveryAnalyticsResult;
  hasDependencies: boolean;

  @Input()
  set event(event: Trace) {
    this.result = event.data.deliveryAnalytics;
    // this.result = this.getResultNotTested();
    this.hasDependencies = STATUS_WITH_DEPENDENCIES.includes(this.result.status);
  }

  private getResultMissingDependencies(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.MissingDependencies,
      service: 'email-service',
      tag: '0.7.3',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      tags: {},
      serviceCalls: { services: [], calls: [] },
      recommendation: { before: [], after: [] },
    };
  }

  private getResultTagDeployed(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.TagDeployed,
      service: 'checkout',
      tag: '0.5.1',
      deployedTag: '0.5.1',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      tags: {},
      serviceCalls: { services: [], calls: [] },
      recommendation: { before: [], after: [] },
    };
  }

  private getResultNewerTagDeployed(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.NewerTagDeployed,
      service: 'checkout',
      tag: '0.5.1',
      deployedTag: '0.5.3',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      tags: {},
      serviceCalls: { services: [], calls: [] },
      recommendation: { before: [], after: [] },
    };
  }

  private getResultNotTested(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.NotTested,
      service: 'checkout',
      tag: '0.5.1',
      deployedTag: '0.5.0',
      testedStage: 'staging',
      targetStage: 'production',
      tags: {
        'frontend': '1.2.8',
        'carts': '0.4.4',
        'checkout': '0.5.1',
        'cache': '1.0.0',
        'payment': '2.0.3',
      },
      problematicServices: [{ service: 'frontend', tag: '1.2.8', result: ResultTypes.FAILED }, { service: 'cache', tag: '1.0.0', result: ResultTypes.WARNING }],
      serviceCalls: { services: ['carts', 'cache', 'checkout', 'payment', 'frontend'], calls: [{ from: 'frontend', to: 'checkout' }, { from: 'checkout', to: 'carts' }, { from: 'checkout', to: 'payment' }, { from: 'carts', to: 'cache' }] },
      recommendation: { before: [], after: [] },
    };
  }

  private getResultOk(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.Ok,
      service: 'checkout',
      tag: '0.5.1',
      deployedTag: '0.5.0',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      tags: {
        'frontend': '1.2.8',
        'carts': '0.4.4',
        'checkout': '0.5.1',
        'cache': '1.0.0',
        'payment': '2.0.3',
      },
      serviceCalls: { services: ['carts', 'cache', 'checkout', 'payment', 'frontend'], calls: [{ from: 'frontend', to: 'checkout' }, { from: 'checkout', to: 'carts' }, { from: 'checkout', to: 'payment' }, { from: 'carts', to: 'cache' }] },
      recommendation: { before: [], after: [] },
    };
  }

  private getResultMismatch(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.Mismatch,
      service: 'carts',
      tag: '0.4.4',
      deployedTag: '0.4.2',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      tags: {
        'frontend': '1.2.8',
        'carts': '0.4.4',
        'checkout': '0.5.1',
        'cache': '1.0.0',
      },
      serviceCalls: { services: ['carts', 'cache', 'checkout', 'frontend'], calls: [{ from: 'frontend', to: 'checkout' }, { from: 'frontend', to: 'carts' }, { from: 'checkout', to: 'carts' }, { from: 'carts', to: 'cache' }] },
      recommendation: { before: [], after: [{ service: 'checkout', type: MismatchType.Tag, tagTested: '0.5.1', tagTarget: '0.5.0' }, { service: 'frontend', type: MismatchType.Dependency, tagTested: '1.2.8' }] },
    };
  }
}
