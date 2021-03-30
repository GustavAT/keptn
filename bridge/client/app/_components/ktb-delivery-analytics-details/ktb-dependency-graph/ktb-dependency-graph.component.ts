import { AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DeliveryAnalyticsResult } from 'client/app/_models/delivery-analytics-result';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LegendItem } from './legend-item';
import { createLegendItems, createDotNotation } from './util';

@Component({
  selector: 'ktb-dependency-graph',
  templateUrl: './ktb-dependency-graph.component.html',
  styleUrls: ['./ktb-dependency-graph.component.scss']
})
export class KtbDependencyGraphComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('dependencyGraph', { static: false })
  container: ElementRef;

  service: string;
  tag: string;
  testedStage: string;
  legendItems: LegendItem[];

  private readonly graph$ = new ReplaySubject<string>();
  private readonly destroy$ = new Subject<void>();

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this.service = result.service;
    this.tag = result.tag;
    this.testedStage = result.testedStage;

    this.legendItems = createLegendItems(result);

    const dotNotation = createDotNotation(result);
    this.graph$.next(dotNotation);
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
      .fit(true)
      .renderDot(dotNotation);
  }
}
