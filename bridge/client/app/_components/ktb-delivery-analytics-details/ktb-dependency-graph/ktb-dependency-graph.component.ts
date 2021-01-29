import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeliveryAnalyticsResult, MismatchType } from 'client/app/_models/delivery-analytics-result';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';

const SERVICE_COLOR = 'dodgerblue';
const ERROR_COLOR = 'red';
const WARNING_COLOR = 'gold';
const COLOR_IGNORE = 'gray';
const FONT_COLOR = 'black';

@Component({
  selector: 'ktb-dependency-graph',
  templateUrl: './ktb-dependency-graph.component.html',
  styleUrls: ['./ktb-dependency-graph.component.scss']
})
export class KtbDependencyGraphComponent implements OnInit, AfterViewInit {

  private _result: DeliveryAnalyticsResult;
  private _graph: string;

  @ViewChild('dependencyGraph', { static: false })
  container: ElementRef;

  @Input()
  set result(result: DeliveryAnalyticsResult) {
    this._result = result;

    this.initializeGraph();
  }

  ngAfterViewInit() {
    this.renderGraph();
  }

  ngOnInit() {
    wasmFolder('/assets/@hpcc-js/wasm/dist/');
  }

  private initializeGraph() {
    const nodes = this._result?.dependencies.nodes || [];
    const edges = this._result?.dependencies.edges || [];
    const pMismatches = this._result.parentResult || [];
    const cMimmatches = this._result.childResult || [];

    const dotNodes: string[] = [];

    for (let node of nodes) {
      let nodeString: string;
      if (node === this._result.service) {
        nodeString = `node [shape=ellipse, fontname=monospace, fontcolor=${FONT_COLOR}, color=${SERVICE_COLOR}, style=solid] ${node};`;
      } else {
        const pM = pMismatches.find((value) => value.service === node);
        if (pM) {
          nodeString = `node [shape=ellipse, fontname=monospace, fontcolor=${FONT_COLOR}, color=${ERROR_COLOR}, style=${pM.type === MismatchType.Tag ? 'solid' : 'dashed'}] ${node};`;
        } else {
          const cM = cMimmatches.find((value) => value.service === node);
          if (cM) {
            nodeString = `node [shape=ellipse, fontname=monospace, fontcolor=${FONT_COLOR}, color=${WARNING_COLOR}, style=${cM.type === MismatchType.Tag ? 'solid' : 'dashed'}] ${node};`;
          } else {
            nodeString = `node [shape=ellipse, fontname=monospace, fontcolor=${COLOR_IGNORE}, color=${COLOR_IGNORE}, style=solid] ${node};`;
          }
        }
      }

      dotNodes.push(nodeString);
    }

    const dotEdges: string[] = [];
    for (let { v, w } of edges) {
      dotEdges.push(`${v}->${w} [penwidth=0.8, arrowsize=0.8];`);
    }

    this._graph = `
    digraph {
      rankdir=LR;
      ${dotNodes.join('\n')}
      ${dotEdges.join('\n')}
    }`;

    console.log(this._graph)
  }

  private renderGraph() {
    graphviz(this.container.nativeElement)
      .width('100%')
      .fit(true)
      .renderDot(this._graph);
  }
}