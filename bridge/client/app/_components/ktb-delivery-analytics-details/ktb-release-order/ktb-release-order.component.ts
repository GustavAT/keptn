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

  hasParents: boolean;
  hasChildren: boolean;

  parentMismatches: Mismatch[];
  childMismatches: Mismatch[];

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.service = result.service;
    this.tag = result.tag;
    this.deployedTag = result.deployedTag;
    this.targetStage = result.targetStage;

    const { parents, children } = result.dependencies;
    this.hasParents = parents.length > 0;
    this.hasChildren = children.length > 0;

    this.parentMismatches = result.mismatches.parents;
    this.childMismatches = result.mismatches.children;
  }
}
