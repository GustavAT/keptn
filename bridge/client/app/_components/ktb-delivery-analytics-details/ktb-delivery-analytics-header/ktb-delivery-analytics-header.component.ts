import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsStatus, DeliveryAnalyticsResult } from 'client/app/_models/delivery-analytics-result';
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
  readonly STATUS_NOT_TESTED = AnalyticsStatus.NotTested;
  readonly STATUS_MISMATCH = AnalyticsStatus.Mismatch;
  readonly STATUS_OK = AnalyticsStatus.Ok;

  status: AnalyticsStatus;
  service: string;
  tag: string;
  deployedTag: string | undefined;
  testedStage: string;
  targetStage: string;
  failedServices: { service: string; result: ResultTypes }[];

  hasParentMismatches: boolean;

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.status = result.status;
    this.service = result.service;
    this.tag = result.tag;
    this.deployedTag = result.deployedTag;
    this.testedStage = result.testedStage;
    this.targetStage = result.targetStage;
    this.failedServices = result.failedServices;
    this.hasParentMismatches = result.mismatches.parents.length > 0;
  }

}
