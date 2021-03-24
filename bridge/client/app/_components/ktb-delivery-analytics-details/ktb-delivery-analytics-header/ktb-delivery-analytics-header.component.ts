import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsStatus, DeliveryAnalyticsResult, EvaluationResult } from 'client/app/_models/delivery-analytics-result';
import { ResultTypes } from 'client/app/_models/result-types';

@Component({
  selector: 'ktb-delivery-analytics-header',
  templateUrl: './ktb-delivery-analytics-header.component.html',
  styleUrls: ['./ktb-delivery-analytics-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbDeliveryAnalyticsHeaderComponent {

  readonly STATUS_MISSING_DEPENDENCIES = AnalyticsStatus.MissingDependencies;
  readonly STATUS_TAG_DEPLOYED = AnalyticsStatus.TagDeployed;
  readonly STATUS_NEWER_TAG_DEPLOYED = AnalyticsStatus.NewerTagDeployed;
  readonly STATUS_CONFIGURATION_NOT_EXISTING = AnalyticsStatus.ConfigurationNotExisting;

  status: AnalyticsStatus;
  service: string;
  tag: string;
  deployedTag: string | undefined;
  testedStage: string;
  targetStage: string;
  problematicServices: EvaluationResult[];

  safeToDeploy: boolean;              // No issues with the service and its dependencies
  safeToDeployWithWarnings: boolean;  // Incoming dependencies are not ok. Outgoing dependencies are up-to-date
  notSafeToDeploy: boolean;           // Outgoing dependencies are not ok. Incoming dependencies might be up-to-date
  notTested: boolean;                 // At least one quality gate of the service' dependencies failed or passed with warning

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.status = result.status;
    this.service = result.service;
    this.tag = result.tag;
    this.deployedTag = result.deployedTag;
    this.testedStage = result.testedStage;
    this.targetStage = result.targetStage;
    this.problematicServices = result.problematicServices;

    this.safeToDeploy = result.status === AnalyticsStatus.Ok;
    const canUpdate = result.recommendation.before.length === 0;
    this.safeToDeployWithWarnings = result.status === AnalyticsStatus.Mismatch && canUpdate;
    this.notSafeToDeploy = result.status === AnalyticsStatus.Mismatch && !canUpdate;
    this.notTested = result.status === AnalyticsStatus.NotTested;
  }

}
