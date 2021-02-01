import { Component, Input } from '@angular/core';
import { Mismatch, MismatchType } from 'client/app/_models/delivery-analytics-result';

@Component({
  selector: 'ktb-release-order',
  templateUrl: './ktb-release-order.component.html',
  styleUrls: ['./ktb-release-order.component.scss']
})
export class KtbReleaseOrderComponent {

  readonly DEPENDENCY_MISMATCH = MismatchType.Dependency;
  readonly TAG_MISMATCH = MismatchType.Tag;

  @Input()
  serviceName: string;

  @Input()
  tag: string;

  @Input()
  parentMismatches: Mismatch[];

  @Input()
  childMismatches: Mismatch[];

  @Input()
  hasParents: boolean;

  @Input()
  hasChildren: boolean;
}
