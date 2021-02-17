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
  hasProblematicServices: boolean;

  @Input()
  set event(event: Trace) {
    this.result = event.data.deliveryAnalytics;
    // this.result = this.getResultMissingDependencies();
    this.hasDependencies = STATUS_WITH_DEPENDENCIES.includes(this.result.status);
    this.hasProblematicServices = this.result.problematicServices?.length > 0;
  }

  private getResultMissingDependencies(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.MissingDependencies,
      service: 'email-service',
      tag: '0.7.3',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      dependencies: { parents: [], children: [], relations: [] },
      mismatches: { parents: [], children: [] },
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
      dependencies: { parents: [], children: [], relations: [] },
      mismatches: { parents: [], children: [] },
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
      dependencies: { parents: [], children: [], relations: [] },
      mismatches: { parents: [], children: [] },
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
      problematicServices: [{ service: 'fontend', tag: '0.4.3', result: ResultTypes.FAILED }],
      dependencies: { parents: ['carts', 'cache', 'payment'], children: ['frontend'], relations: [{ from: 'frontend', to: 'checkout' }, { from: 'checkout', to: 'carts' }, { from: 'checkout', to: 'payment' }, { from: 'carts', to: 'cache' }] },
      mismatches: { parents: [], children: [] },
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
      dependencies: { parents: ['carts', 'cache', 'payment'], children: ['frontend'], relations: [{ from: 'frontend', to: 'checkout' }, { from: 'checkout', to: 'carts' }, { from: 'checkout', to: 'payment' }, { from: 'carts', to: 'cache' }] },
      mismatches: { parents: [], children: [] },
    };
  }

  private getResultMismatch(): DeliveryAnalyticsResult {
    return {
      status: AnalyticsStatus.Mismatch,
      service: 'checkout',
      tag: '0.5.1',
      deployedTag: '0.5.0',
      testedStage: 'staging',
      targetStage: 'production',
      problematicServices: [],
      dependencies: { parents: ['carts', 'cache', 'payment'], children: ['frontend'], relations: [{ from: 'frontend', to: 'checkout' }, { from: 'checkout', to: 'carts' }, { from: 'checkout', to: 'payment' }, { from: 'carts', to: 'cache' }] },
      mismatches: { parents: [{ service: 'cache', type: MismatchType.Tag, tagTested: '0.5.1', tagTarget: '0.5.0' }], children: [{ service: 'frontend', type: MismatchType.Dependency, tagTested: '0.5.0' }] },
    };
  }



  // private getResultParentsMissing(): DeliveryAnalyticsResult {
  //   return {
  //     result: ResultTypes.FAILED,
  //     service: 'checkout',
  //     tag: '0.5.1',
  //     dependencies: {
  //       parents: ['carts', 'cache', 'payment', 'product-catalog'],
  //       children: ['frontend'],
  //       edges: [
  //         { v: 'frontend', w: 'checkout' },
  //         { v: 'checkout', w: 'carts' },
  //         { v: 'checkout', w: 'payment' },
  //         { v: 'checkout', w: 'product-catalog' },
  //         { v: 'carts', w: 'cache' },
  //       ],
  //     },
  //     parentResult: [
  //       { service: 'payment', tagTested: '0.5.0', type: MismatchType.Dependency },
  //       { service: 'cache', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
  //     ],
  //     childResult: [],
  //   };
  // }

  // private getResultChildrenMissing(): DeliveryAnalyticsResult {
  //   return {
  //     result: ResultTypes.WARNING,
  //     service: 'cache',
  //     tag: '0.5.1',
  //     dependencies: {
  //       parents: [],
  //       children: ['carts', 'checkout', 'frontend'],
  //       edges: [
  //         { v: 'frontend', w: 'checkout' },
  //         { v: 'checkout', w: 'carts' },
  //         { v: 'carts', w: 'cache' },
  //       ],
  //     },
  //     parentResult: [],
  //     childResult: [
  //       { service: 'carts', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
  //       { service: 'frontend', tagTested: '0.5.0', type: MismatchType.Dependency },
  //     ],
  //   };
  // }

  // private getResultAllMissing(): DeliveryAnalyticsResult {
  //   return {
  //     result: ResultTypes.FAILED,
  //     service: 'carts',
  //     tag: '0.5.1',
  //     dependencies: {
  //       parents: ['cache'],
  //       children: ['checkout', 'frontend'],
  //       edges: [
  //         { v: 'frontend', w: 'checkout' },
  //         { v: 'checkout', w: 'carts' },
  //         { v: 'carts', w: 'cache' },
  //       ],
  //     },
  //     parentResult: [
  //       { service: 'cache', tagTested: '0.5.3', tagTarget: '0.5.0', type: MismatchType.Tag },
  //     ],
  //     childResult: [
  //       { service: 'frontend', tagTested: '0.5.0', type: MismatchType.Dependency },
  //     ],
  //   };
  // }

  // private getResultNoParentsAndChildren(): DeliveryAnalyticsResult {
  //   return {
  //     result: ResultTypes.PASSED,
  //     service: 'cache',
  //     tag: '0.5.1',
  //     dependencies: {
  //       parents: [],
  //       children: [],
  //       edges: [],
  //     },
  //     parentResult: [],
  //     childResult: [],
  //   };
  // }

  // private getResultAllOk(): DeliveryAnalyticsResult {
  //   return {
  //     result: ResultTypes.PASSED,
  //     service: 'carts',
  //     tag: '0.5.1',
  //     dependencies: {
  //       parents: ['cache'],
  //       children: ['checkout'],
  //       edges: [
  //         { v: 'checkout', w: 'carts' },
  //         { v: 'carts', w: 'cache' },
  //       ],
  //     },
  //     parentResult: [],
  //     childResult: [],
  //   };
  // }
}
