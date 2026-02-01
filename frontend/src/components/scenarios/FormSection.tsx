import {motion} from 'framer-motion';
import type {ReactNode } from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    delay? : number;
}

export const FormSection = ({
    title, description, children, delay = 0
}: FormSectionProps) => {
    return (
    <motion.div
        initial = {{opacity: 0, y: 20}}
        animate = {{opacity: 1, y: 0}}
        transition = {
            {
                duration : 0.4,
                delay}}
        className = "mb-8">
            <div className='mb-4'>
                <h3 className = "text-lg font-semibold">{title}</h3>
                {description && <p className = "text-sm text-muted-foreground">{description}</p>}
            </div>
                {children}
        </motion.div>
    )
}
