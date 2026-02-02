import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black relative px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight mb-1 sm:mb-2"
        >
          Retail Scenario
        </motion.h1>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight mb-4 sm:mb-6"
        >
          Configurator
        </motion.h1>
        
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.5 }}
          className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#f97316] text-white text-xs sm:text-sm font-medium rounded-full"
        >
          demo
        </motion.span>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4"
        >
          Empowering non-technical teams to create data-driven demos
        </motion.p>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1 }} 
        className="absolute bottom-4 sm:bottom-6 lg:bottom-8"
      >
        <motion.div 
          animate={{ y: [0, 6, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
          className="flex flex-col items-center text-gray-500"
        >
          <span className="text-[10px] sm:text-xs mb-1">Scroll</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
