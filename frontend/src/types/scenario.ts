export interface Scenario {
    _id?: string;
    name: string;
    salesMultiplier: number;
    productCategories: string[];
    regions: string[];
    customerSegments: string[];
    dateRange: {
      start: string;
      end: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }
  

  export type ScenarioFormData = Omit<Scenario, '_id' | 'createdAt' | 'updatedAt'>;