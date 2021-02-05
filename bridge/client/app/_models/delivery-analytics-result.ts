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
    MissingDependencies,
    TagDeployed,
    NewerTagDeployed,
    NotTested,
    Mismatch,
    Ok,
};

export interface DeliveryAnalyticsResult {
    status: AnalyticsStatus;
    service: string;
    tag: string;
    deployedTag?: string;
    testedStage: string;
    targetStage: string;
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
