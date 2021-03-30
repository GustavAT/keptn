import { AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AnalyticsStatus, DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';
import { DtColors } from '@dynatrace/barista-components/theming';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResultTypes } from 'client/app/_models/result-types';

const SERVICE_COLOR = DtColors.BLUE_600;
const ERROR_COLOR = DtColors.RED_600;
const WARNING_COLOR = DtColors.YELLOW_600;
const COLOR_IGNORE = DtColors.GRAY_600;
const FONT_COLOR = DtColors.GRAY_900;

const createNode = (serviceName: string, tag: string, color: string, style: 'solid' | 'dashed'): string =>
  `node [shape=ellipse, fontname=monospace, fontcolor="${FONT_COLOR}", color="${color}", style=${style}] "${serviceName}\n${tag}";`;

const generateDotNotation = (result: DeliveryAnalyticsResult): string => {

  const items: string[] = result.status === AnalyticsStatus.NotTested
    ? getNodesForEvaluation(result)
    : getNodesForMismatches(result);

  for (const { from, to } of result.serviceCalls.calls) {
    const fromTag = result.tags[from] || '';
    const toTag = result.tags[to] || '';
    items.push(`"${from}\n${fromTag}"->"${to}\n${toTag}" [splines=true];`);
  }

  return `digraph {
      rankdir=LR;
      ${items.join('\n')}
    }`;
};

const getNodesForMismatches = ({ service, serviceCalls, recommendation, tags }: DeliveryAnalyticsResult): string[] => {
  const updateBeforeList = recommendation.before;
  const updateAfterList = recommendation.after;

  return serviceCalls.services.map((current) => {
    const tag = tags[current] || '';
    let nodeString: string;
    if (current === service) {
      nodeString = createNode(current, tag, SERVICE_COLOR, 'solid');
    } else {
      const parentMismatch = updateBeforeList.find((value) => value.service === current);
      if (parentMismatch) {
        nodeString = createNode(current, tag, ERROR_COLOR, parentMismatch.type === MismatchType.Tag ? 'solid' : 'dashed');
      } else {
        const childMismatch = updateAfterList.find((value) => value.service === current);
        if (childMismatch) {
          nodeString = createNode(current, tag, ERROR_COLOR, childMismatch.type === MismatchType.Tag ? 'solid' : 'dashed');
        } else {
          nodeString = createNode(current, tag, COLOR_IGNORE, 'solid');
        }
      }
    }

    return nodeString;
  });
}

const getNodesForEvaluation = ({ service, serviceCalls, problematicServices, tags }: DeliveryAnalyticsResult): string[] => {
  const withWarning = problematicServices
    .filter((evaluation) => evaluation.result === ResultTypes.WARNING)
    .map((evaluation) => evaluation.service);
  const withError = problematicServices
    .filter((evaluation) => evaluation.result === ResultTypes.FAILED)
    .map((evaluation) => evaluation.service);

  return serviceCalls.services.map((current) => {
    let color: string = SERVICE_COLOR;
    if (current !== service) {
      if (withWarning.includes(current)) {
        color = WARNING_COLOR;
      } else if (withError.includes(current)) {
        color = ERROR_COLOR;
      } else {
        color = COLOR_IGNORE;
      }
    }

    return createNode(current, tags[current] || '', color, 'solid');
  });
};

@Component({
  selector: 'ktb-dependency-graph',
  templateUrl: './ktb-dependency-graph.component.html',
  styleUrls: ['./ktb-dependency-graph.component.scss']
})
export class KtbDependencyGraphComponent implements OnInit, OnDestroy, AfterViewInit {

  targetStage: string;

  // TODO: move legend into its own component
  hasQualityGateWarning: boolean; // Services that pass the quality gate with warning
  hasQualityGateFailed: boolean;  // Services that fail the quality gate
  hasTagMismatch: boolean;        // Service exists with a tag-mismatch (outdated version)
  hasDependencyMismatch: boolean; // Service exists with a dependency mismatch (not deployed)
  hasNoIssues: boolean;           // Service exists that is up-to-date

  @ViewChild('dependencyGraph', { static: false })
  container: ElementRef;

  private readonly graph$ = new ReplaySubject<string>();
  private readonly destroy$ = new Subject<void>();

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.targetStage = result.targetStage;

    const hasMismatch = result.status === AnalyticsStatus.Mismatch;
    const isNotTested = result.status === AnalyticsStatus.NotTested;
    const allMismatches = [...result.recommendation.before, ...result.recommendation.after];

    this.hasTagMismatch = hasMismatch && allMismatches.some((mismatch) => mismatch.type === MismatchType.Tag);
    this.hasDependencyMismatch = hasMismatch && allMismatches.some((mismatch) => mismatch.type === MismatchType.Dependency);
    this.hasNoIssues = hasMismatch && result.serviceCalls.services.length > allMismatches.length;
    this.hasQualityGateWarning = isNotTested && result.problematicServices.some((service) => service.result === ResultTypes.WARNING);
    this.hasQualityGateFailed = isNotTested && result.problematicServices.some((service) => service.result === ResultTypes.FAILED);

    this.graph$.next(generateDotNotation(result));
  }

  ngAfterViewInit() {
    this.graph$
      .pipe(takeUntil(this.destroy$))
      .subscribe((graph) => {
        this.renderGraph(graph);
      });
  }

  ngOnInit() {
    // Path to graphviz webassembly - required for rendering the dot-notation with d3-graphviz
    wasmFolder('/assets/@hpcc-js/wasm/dist/');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private renderGraph(dotNotation: string) {
    graphviz(this.container.nativeElement)
      .width('100%')
      .height('100%')
      .fit(true)
      .renderDot(dotNotation);
  }
}
