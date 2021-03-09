import { AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';
import { DtColors } from '@dynatrace/barista-components/theming';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const SERVICE_COLOR = DtColors.BLUE_600;
const ERROR_COLOR = DtColors.RED_600;
const COLOR_IGNORE = DtColors.GRAY_600;
const FONT_COLOR = DtColors.GRAY_900;

const createNode = (name: string, color: string, style: 'solid' | 'dashed'): string =>
  `node [shape=ellipse, fontname=monospace, fontcolor="${FONT_COLOR}", color="${color}", style=${style}] "${name}";`;

const generateDotNotation = ({ service, serviceCalls, recommendation }: DeliveryAnalyticsResult): string => {
  const updateBeforeList = recommendation.before;
  const updateAfterList = recommendation.after;

  const items: string[] = [];

  for (let svc of serviceCalls.services) {
    let nodeString: string;
    if (svc === service) {
      nodeString = createNode(svc, SERVICE_COLOR, 'solid');
    } else {
      const parentMismatch = updateBeforeList.find((value) => value.service === svc);
      if (parentMismatch) {
        nodeString = createNode(svc, ERROR_COLOR, parentMismatch.type === MismatchType.Tag ? 'solid' : 'dashed');
      } else {
        const childMismatch = updateAfterList.find((value) => value.service === svc);
        if (childMismatch) {
          nodeString = createNode(svc, ERROR_COLOR, childMismatch.type === MismatchType.Tag ? 'solid' : 'dashed');
        } else {
          nodeString = createNode(svc, COLOR_IGNORE, 'solid');
        }
      }
    }

    items.push(nodeString);
  }

  for (let { from, to } of serviceCalls.calls) {
    items.push(`"${from}"->"${to}" [splines=true];`);
  }

  return `digraph {
      rankdir=LR;
      ${items.join('\n')}
    }`;
};

@Component({
  selector: 'ktb-dependency-graph',
  templateUrl: './ktb-dependency-graph.component.html',
  styleUrls: ['./ktb-dependency-graph.component.scss']
})
export class KtbDependencyGraphComponent implements OnInit, OnDestroy, AfterViewInit {

  service: string;
  tag: string;
  testedStage: string;
  targetStage: string;

  hasTagMismatch: boolean;        // Service exists with a tag-mismatch (outdated version)
  hasDependencyMismatch: boolean; // Service exists with a dependency mismatch (not deployed)
  hasNoIssues: boolean;           // Service exists that is up-to-date

  @ViewChild('dependencyGraph', { static: false })
  container: ElementRef;

  private readonly graph$ = new ReplaySubject<string>();
  private readonly destroy$ = new Subject<void>();

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.service = result.service;
    this.tag = result.tag;
    this.testedStage = result.testedStage;
    this.targetStage = result.targetStage;

    const allMismatches = [...result.recommendation.before, ...result.recommendation.after];
    this.hasTagMismatch = allMismatches.some((mismatch) => mismatch.type === MismatchType.Tag);
    this.hasDependencyMismatch = allMismatches.some((mismatch) => mismatch.type === MismatchType.Dependency);
    this.hasNoIssues = result.serviceCalls.services.length > allMismatches.length;

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
    console.log('destroy');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private renderGraph(dotNotation: string) {
    graphviz(this.container.nativeElement)
      .width('100%')
      .fit(true)
      .renderDot(dotNotation);
  }
}
