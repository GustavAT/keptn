import { ResultTypes } from "./result-types";

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

export const enum AnalyticsStatus {
    MissingDependencies = 'MissingDependencies',
    TagDeployed = 'TagDeployed',
    NewerTagDeployed = 'NewerTagDeployed',
    ConfigurationNotExisting = 'ConfigurationNotExisting',
    NotTested = 'NotTested',
    Mismatch = 'Mismatch',
    Ok = 'Ok',
};

export interface EvaluationResult {
    service: string;
    tag: string;
    result: ResultTypes;
}

export interface DeliveryAnalyticsResult {
    status: AnalyticsStatus;
    service: string;
    tag: string;
    deployedTag?: string;
    testedStage: string;
    targetStage: string;
    problematicServices: EvaluationResult[];
    tags: { [key: string]: string };
    serviceCalls: {
        services: string[];
        calls: { from: string; to: string; }[];
    };
    recommendation: {
        before: Mismatch[];
        after: Mismatch[];
    };
}
