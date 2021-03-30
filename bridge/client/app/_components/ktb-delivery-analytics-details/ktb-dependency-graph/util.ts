import { DtColors } from "@dynatrace/barista-components/theming";
import { AnalyticsStatus, DeliveryAnalyticsResult, MismatchType } from "client/app/_models/delivery-analytics-result";
import { ResultTypes } from "client/app/_models/result-types";
import { LegendItem } from "./legend-item";

const SERVICE_COLOR = DtColors.BLUE_600;
const ERROR_COLOR = DtColors.RED_600;
const WARNING_COLOR = DtColors.YELLOW_600;
const COLOR_IGNORE = DtColors.GRAY_600;
const FONT_COLOR = DtColors.GRAY_900;

/**
 * Create a node in dot-notation
 * @param serviceName Service name
 * @param tag Service tag
 * @param color Node color
 * @param style Node style
 * @returns Node in dot-notation
 */
const createNode = (serviceName: string, tag: string, color: string, style: 'solid' | 'dashed'): string =>
    `node [shape=ellipse, fontname=monospace, fontcolor="${FONT_COLOR}", color="${color}", style=${style}] "${serviceName}\n${tag}";`;

/**
 * Create nodes colored based on their tag and dependency mismatches
 * @param param0 delivery analytics result
 * @returns All dependencies in dot-notation
 */
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

/**
 * Create nodes colored based on their evaluation results
 * @param param0 delivery analytics result
 * @returns All dependencies in dot-notation
 */
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

/**
 * Creates a dependency/call graph in dot-notation based on the delivery analytics result
 * @param result Delivery analytics result
 * @returns Dependency/Call graph in dot-notation
 */
export const createDotNotation = (result: DeliveryAnalyticsResult): string => {

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

/**
 * Create legend items based on the delivery analytics result
 * @param result Delivery analytics result
 * @returns Legend items
 */
export const createLegendItems = (result: DeliveryAnalyticsResult): LegendItem[] => {
    const items: LegendItem[] = [];
    const targetStage = result.targetStage;
    const hasMismatch = result.status === AnalyticsStatus.Mismatch;
    const isNotTested = result.status === AnalyticsStatus.NotTested;
    const mismatches = [...result.recommendation.before, ...result.recommendation.after];

    // Quality Gates
    if (isNotTested) {
        const hasEvaluatedWithWarnings = result.problematicServices.some((service) => service.result === ResultTypes.WARNING);
        if (hasEvaluatedWithWarnings) {
            items.push({ label: 'Quality Gate passed with warning', type: 'warning', style: 'solid' });
        }

        const hasFailedEvaluation = result.problematicServices.some((service) => service.result === ResultTypes.FAILED);
        if (hasFailedEvaluation) {
            items.push({ label: 'Quality Gate failed', type: 'error', style: 'solid' });
        }
    }

    // Mismatches
    if (hasMismatch) {
        const hasTagMismatch = mismatches.some((mismatch) => mismatch.type === MismatchType.Tag);
        if (hasTagMismatch) {
            items.push({ label: `Outdated in ${targetStage}`, type: 'error', style: 'solid' });
        }

        const hasDependencyMismatch = mismatches.some((mismatch) => mismatch.type === MismatchType.Dependency);
        if (hasDependencyMismatch) {
            items.push({ label: `Not deployed in ${targetStage}`, type: 'error', style: 'dashed' });
        }
    }

    // Release target
    items.push({ label: 'Release target', type: 'active', style: 'solid' });

    // There are services (all services - release target) that have no problems:
    const hasNoIssues = (result.serviceCalls.services.length - 1) > mismatches.length;
    if (hasNoIssues) {
        items.push({ label: 'Ok', type: 'inactive', style: 'solid' });
    }

    // Calls relation
    if (result.serviceCalls.calls.length > 0) {
        items.push({ label: 'Calls', type: 'active', style: 'arrow' });
    }

    return items;
};
