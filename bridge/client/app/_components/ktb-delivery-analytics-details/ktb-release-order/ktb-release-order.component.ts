import { Component, Input } from '@angular/core';
import { MismatchType, ReleaseBracketResult } from 'client/app/_models/delivery-analytics-result';

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
  parentMismatches: ReleaseBracketResult | undefined;

  @Input()
  childMismatches: ReleaseBracketResult | undefined;
}
