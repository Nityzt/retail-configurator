import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { HeroSection } from './components/sections/HeroSection';
import { ScenariosSection } from './components/sections/ScenariosSection';
import { CreateSection, type CreateSectionRef } from './components/sections/CreateSection';
import { ScenarioProvider } from './contexts/ScenarioContext';

function App() {
  const createSectionRef = useRef<CreateSectionRef>(null);
  const scenariosRef = useRef<HTMLDivElement>(null);
  const createFormRef = useRef<HTMLDivElement>(null);
  
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 750);
    return () => clearTimeout(timer);
  }, []);

  const handleViewScenarios = () => {
    scenariosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    createSectionRef.current?.resetForm();
    createFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditClick = (id: string) => {
    createSectionRef.current?.loadScenario(id);
    createFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    scenariosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScenarioProvider>
    <div className="bg-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
        html, body, #root {
          height: 100%;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
      
      <Toaster position="top-right" richColors theme="dark" />
      
      {/* Welcome screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden px-4"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ borderRadius: '0' }}
              exit={{ borderRadius: '0 0 50% 50%' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
            
            <motion.h1 
              initial={{ scale:1,opacity: 0, y:30 }} 
              animate={{ scale:1,opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black tracking-tight"
            >
              Welcome
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <section className="h-screen snap-start snap-always">
          <HeroSection 
            onViewScenarios={handleViewScenarios}
            onCreateScenario={handleCreateClick}
          />
        </section>
        
        <section ref={scenariosRef} className="h-screen snap-start snap-always overflow-hidden">
          <ScenariosSection onCreateClick={handleCreateClick} onEditClick={handleEditClick} />
        </section>
        
        <section ref={createFormRef} className="h-screen snap-start snap-always overflow-hidden">
          <CreateSection ref={createSectionRef} onSuccess={handleFormSuccess} />
        </section>
      </main>
    </div>
    </ScenarioProvider>
  );
}

export default App;
