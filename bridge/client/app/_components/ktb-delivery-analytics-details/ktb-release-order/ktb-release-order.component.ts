import { Component, Input } from '@angular/core';
import { AnalyticsStatus, DeliveryAnalyticsResult, EvaluationResult, Mismatch, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { ResultTypes } from 'client/app/_models/result-types';

@Component({
  selector: 'ktb-release-order',
  templateUrl: './ktb-release-order.component.html',
  styleUrls: ['./ktb-release-order.component.scss']
})
export class KtbReleaseOrderComponent {

  readonly DEPENDENCY_MISMATCH = MismatchType.Dependency;
  readonly TAG_MISMATCH = MismatchType.Tag;
  readonly WARNING = ResultTypes.WARNING;
  readonly FAILED = ResultTypes.FAILED;

  service: string;
  tag: string;
  deployedTag: string | undefined;
  targetStage: string;

  hasDescendants: boolean;
  hasAscendants: boolean;

  isNotTested: boolean;
  problematicList: EvaluationResult[];
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

    this.isNotTested = result.status === AnalyticsStatus.NotTested;
    this.problematicList = result.problematicServices;
    this.updateBeforeList = result.recommendation.before;
    this.updateAfterList = result.recommendation.after;
  }
}
