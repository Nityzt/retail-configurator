import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/magnetic-button';
import { PerspectiveText } from '@/components/ui/PerspectiveText';

interface HeroSectionProps {
  onViewScenarios?: () => void;
  onCreateScenario?: () => void;
}

export const HeroSection = ({ onViewScenarios, onCreateScenario }: HeroSectionProps) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black relative px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[7vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw] font-semibold text-white tracking-tight mb-1 sm:mb-2 leading-tight"
        >
          Retail Scenario
        </motion.h1>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[7vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw] font-semibold text-white tracking-tight mb-4 sm:mb-6 leading-tight"
        >
          Configurator
        </motion.h1>
        
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-block px-[2vw] sm:px-4 py-[0.5vw] sm:py-1.5 bg-[#f97316] text-white text-[2.5vw] sm:text-sm font-medium rounded-full"
        >
          demo
        </motion.span>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-[3vw] sm:mt-6 text-[3vw] sm:text-base text-gray-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4"
        >
          Empowering non-technical teams to create data-driven demos
        </motion.p>

        {/* Navigation Buttons with Magnetic + Perspective animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-[5vw] sm:mt-10 flex flex-col sm:flex-row gap-[2vw] sm:gap-4 justify-center items-center"
        >
          <MagneticButton 
            onClick={onViewScenarios}
            className="perspective-btn w-[40vw] sm:w-auto h-[10vw] sm:h-12 px-[4vw] sm:px-6 bg-white/10 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer transition-colors"
          >
            <span className="text-white text-[2.5vw] sm:text-sm font-medium">
              <PerspectiveText>View Scenarios</PerspectiveText>
            </span>
          </MagneticButton>
          
          <MagneticButton 
            onClick={onCreateScenario}
            className="perspective-btn w-[40vw] sm:w-auto h-[10vw] sm:h-12 px-[4vw] sm:px-6 bg-[#f97316] hover:bg-[#ea580c] rounded-full overflow-hidden cursor-pointer transition-colors"
          >
            <span className="text-white text-[2.5vw] sm:text-sm font-medium">
              <PerspectiveText>Create Scenario</PerspectiveText>
            </span>
          </MagneticButton>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.2 }} 
        className="absolute bottom-[2vw] sm:bottom-6 lg:bottom-8"
      >
        <motion.div 
          animate={{ y: [0, 6, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
          className="flex flex-col items-center text-gray-500"
        >
          <span className="text-[2vw] sm:text-xs mb-1">Scroll</span>
          <svg className="w-[2.5vw] h-[2.5vw] sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
