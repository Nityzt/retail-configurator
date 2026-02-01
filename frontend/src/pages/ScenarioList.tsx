import {motion} from 'framer-motion';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';

export const ScenarioList = () => {
    const scenarios = [];

    return (
    <div className = "container mx-auto px-4 py-8">
        <motion.div
        initial = {{opacity: 0, y: 20}}
        animate = {{opacity: 1, y: 0}}
        transition = {{duration: 0.5}}
        >
            <div className = "flex justify-between items-center mb-8">
                <h1 className = "text-3xl font-bold">Scenarios</h1>
                <Button>
                    <Plus className = "mr-2 h-4 w-4"/>
                    New Scenario
                </Button>
            </div>

{
    // Scenario cards would be mapped here
}

        </motion.div>

    </div>

    )
}