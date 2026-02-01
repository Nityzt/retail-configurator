import {motion} from 'framer-motion';
import {FileX} from 'lucide-react';
import {Button} from '@/components/ui/button';

export const EmptyState = ({onCreateNew} : { onCreateNew: () => void}) => {
    return (
    <motion.div
        initial = {{opacity: 0, scale: 0.9}}
        animate = {{opacity: 1, scale: 1}}
        transition = {{duration: 0.5}}
        className = "text-center py-16"
        >

        <FileX className= "w-16 h-16 mx-auto text-muted-foreground"/>
        <h2 className = "text-2xl font-semibold mb-2">No Scenarios Found</h2>
        <p className = "text-muted-foreground mb-6">
            Get started by creating a new scenario
        </p>
        <Button onClick={onCreateNew}>
            Create New Scenario
        </Button>
    </motion.div>   
    )}