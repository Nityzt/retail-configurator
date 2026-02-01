export interface Scenario {
    _id? : string;
    name : string;
    dateRange : {
        start : Date;
        end : Date;
    };
    productCategories : string[];
    salesMultiplier : number;
    regions : string[];
    customerSegments : string[];
    createdAt? : Date;
    updatedAt? : Date;
}

export interface ScenarioFormData {
    name : string;
    dateRange : {
        start : string;
        end : string;
    };

    productCategories : string[];
    salesMultiplier : number;
    regions : string[];
    customerSegments : string[];
}