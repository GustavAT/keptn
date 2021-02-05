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

export interface DeliveryAnalyticsResult {
    status: AnalyticsStatus;
    service: string;
    tag: string;
    deployedTag?: string;
    testedStage: string;
    targetStage: string;
    failedServices: { service: string, result: ResultTypes }[];
    dependencies: {
        parents: string[];
        children: string[];
        relations: { from: string; to: string; }[];
    };
    mismatches: {
        parents: Mismatch[];
        children: Mismatch[];
    };
}
