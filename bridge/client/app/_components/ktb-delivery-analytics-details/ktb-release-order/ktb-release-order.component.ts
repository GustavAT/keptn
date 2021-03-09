import { Component, Input } from '@angular/core';
import { DeliveryAnalyticsResult, Mismatch, MismatchType } from 'client/app/_models/delivery-analytics-result';

@Component({
  selector: 'ktb-release-order',
  templateUrl: './ktb-release-order.component.html',
  styleUrls: ['./ktb-release-order.component.scss']
})
export class KtbReleaseOrderComponent {

  readonly DEPENDENCY_MISMATCH = MismatchType.Dependency;
  readonly TAG_MISMATCH = MismatchType.Tag;

  service: string;
  tag: string;
  deployedTag: string | undefined;
  targetStage: string;

  hasDescendants: boolean;
  hasAscendants: boolean;

  updateBeforeList: Mismatch[];
  updateAfterList: Mismatch[];

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.service = result.service;
    this.tag = result.tag;
    this.deployedTag = result.deployedTag;
    this.targetStage = result.targetStage;

    const calls = result.serviceCalls.calls;
    this.hasDescendants = calls.filter(({ from }) => from === this.service).length > 0;
    this.hasAscendants = calls.filter(({ to }) => to === this.service).length > 0;

    this.updateBeforeList = result.recommendation.before;
    this.updateAfterList = result.recommendation.after;
  }
}
