import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { scenarioSchema, ScenarioFormData } from "@/lib/validation";

export const ScenarioBuilder = () => {
    const form = useForm<ScenarioFormData>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: {
            name: '',
            dateRange: {
                start: '',
                end: '',
            },
            productCategories: [],
            salesMultiplier: 1,
            regions: [],
            customerSegments: [],
        },
    });

    const onSubmit = (data: ScenarioFormData) => {
        console.log(data);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Form fields go here */}
            </form>
        </div>
    );
}

