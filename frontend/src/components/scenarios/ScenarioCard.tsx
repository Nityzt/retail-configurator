import {motion} from 'framer-motion';
import { Calendar, TrendingUp, MapPin } from 'lucide-react';
import {Card} from '@/components/ui/card';
import {Scenario} from '@/types/scenario';
import { ScenarioFormData } from '../../types/scenario';

interface ScenarioCardProps {
    scenario: Scenario;
    index: number;

}

export const ScenarioCard = ({scenario, index} : ScenarioCardProps) => {
    return (
    <motion.div
        initial = {{opacity: 0, y: 50}}
        animate = {{opacity: 1, y: 0}}
        transition = {
            {
                duration : 0.5,
                delay: index * 0.1,
                ease: 'easeOut'
            }
        }
        whileHover={{y: -8}}>
            <Card className = "p-6 cursor-pointer">
                <h3 className = "text-xl font-semibold mb-4">{scenario.name}</h3>

                <div className = "space-y-2 text-sm text-muted-foreground">
                    <div className = "flex items-center gap-2">
                        <Calendar className = "w-4 h-4"/>
                        <span>{/*date range*/}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <TrendingUp className = "w-4 h-4"/>
                        <span>{scenario.salesMultiplier}x multiplier</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <MapPin className = "w-4 h-4"/>
                        <span>{scenario.regions.length} regions</span>

                    </div>

                </div>
            </Card>
        </motion.div>
    )

}