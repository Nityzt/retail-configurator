import {motion} from 'framer-motion';
import {Slider} from '@/components/ui/slider';

interface SalesMultiplierProps {
    value: number;
    onChange: (value: number) => void;
}

export const SalesMultiplier = ({value,onChange}: SalesMultiplierProps) => {
    const getColor = (val: number) => {
        if(val<1) return 'text-red-500';
        if(val<1.5) return 'text-yelow-500';
        return 'text-green-500';
    }

    return (
        <div className = 'space-y-4'>
            <div className='flex justify-between item-center'>
                <span className = "text-sm font-medium"> Sales Volume </span>
                <motion.span
                    key = {value}
                    initial = {{scale:1.2}}
                    animate = {{scale:1}}
                    className = {'text-2xl font-bold ' + getColor(value)}
                    >
                    {value.toFixed(1)}x
                    </motion.span>
            </div>

            <Slider 
            value ={[value]}
            onValueChange = {(vals) => onChange(vals[0])}
            min = {0.5}
            max = {3}
            step = {0.1}
            className = "w-full"
            />

            <div className = 'flex justify-between text-xs text-muted-foreground'>
                <span>Low (0.5x)</span>
                <span>Normal(1x)</span>
                <span>High (3x)</span>
            </div>
        </div>
    )
}

