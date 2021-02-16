import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EvaluationResult } from 'client/app/_models/delivery-analytics-result';
import { ResultTypes } from 'client/app/_models/result-types';

@Component({
  selector: 'ktb-failed-services-view',
  templateUrl: './ktb-failed-services-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbFailedServicesViewComponent {

  readonly FAILED = ResultTypes.FAILED;
  readonly WARNING = ResultTypes.WARNING;

  @Input()
  evaluationResult: EvaluationResult[];
}
