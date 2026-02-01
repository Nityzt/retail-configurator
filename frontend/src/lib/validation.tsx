import {z} from 'zod';

export const scenarioSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    dateRange: z.object({
        start : z.string(),
        end : z.string(),
    }),
    productCategories: z.array(z.string()).min(1, "Select at least one product category"),
    salesMultiplier: z.number().min(0.5).max(3),
    regions: z.array(z.string()).min(1, "Select at least one region"),
    customerSegments: z.array(z.string()).min(1, "Select at least one customer segment"),
});

export type ScenarioFormData = z.infer<typeof scenarioSchema>;