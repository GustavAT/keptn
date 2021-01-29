import { ResultTypes } from './result-types';

export const enum MismatchType {
    Tag,
    Dependency,
}

export interface Mismatch {
    type: MismatchType;
    service: string;
    tagTested: string;
    tagTarget?: string;
}

export interface ReleaseBracketResult {
    service: string;
    mismatches: Mismatch[];
}

export interface DeliveryAnalyticsResult {
    result: ResultTypes;
    service: string;
    tag: string;
    parentResult?: ReleaseBracketResult;
    childResult?: ReleaseBracketResult;
    dependencies?: {
        nodes: string[];
        edges: { v: string; w: string; }[];
    };
}
