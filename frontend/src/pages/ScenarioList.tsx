import { useScenarios } from '@/hooks/useScenarios';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { scrollReveal, cardHover } from '@/lib/animations';
import { toast } from 'sonner';
import MagneticButton from '@/components/ui/magnetic-button';

const ScenarioCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow border-l-4 border-[#f97316] space-y-3">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-3 w-24 mt-4" />
  </div>
);

export const ScenarioList = () => {
  const { scenarios, loading, error, deleteScenario } = useScenarios();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await deleteScenario(id);
        toast.success('Scenario deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete scenario');
        console.error('Error deleting scenario:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-500"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-br from-[#1a1a1a] via-[#c2410c] to-[#f97316] text-white py-20"
        >
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl font-bold mb-4"
            >
              Demo Scenario Configurator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl opacity-90 mb-8"
            >
              Empowering non-technical teams to create data-driven demos
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MagneticButton
                onClick={() => window.location.href = '/new'}
                className="inline-block bg-white text-[#f97316] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                + Create New Scenario
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Scenarios List */}
        <div className="container mx-auto px-4 py-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6"
          >
            Your Scenarios
          </motion.h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ScenarioCardSkeleton key={i} />
              ))}
            </div>
          ) : scenarios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-white rounded-lg shadow"
            >
              <p className="text-gray-500 mb-4">No scenarios yet</p>
              <Link to="/new" className="text-[#f97316] hover:underline">
                Create your first scenario
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {scenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario._id}
                    variants={scrollReveal}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.1 }}
                    layout
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      variants={cardHover}
                      initial="rest"
                      whileHover="hover"
                      className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all border-l-4 border-[#f97316] h-full flex flex-col"
                    >
                      <motion.h3
                        className="text-xl font-semibold mb-2"
                        whileHover={{ color: '#f97316' }}
                      >
                        {scenario.name}
                      </motion.h3>
                      <div className="text-sm text-gray-600 space-y-1 mb-4 flex-1">
                        <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                          Sales Multiplier: {scenario.salesMultiplier}x
                        </motion.p>
                        <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                          Regions: {scenario.regions.join(', ')}
                        </motion.p>
                        <motion.p whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                          Categories: {scenario.productCategories.length}
                        </motion.p>
                        <p className="text-xs text-gray-400">
                          {scenario.dateRange.start} to {scenario.dateRange.end}
                        </p>
                      </div>
                      <div className="flex gap-3 mt-auto">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={`/edit/${scenario._id}`}
                            className="text-[#f97316] hover:text-[#ea580c] text-sm font-medium transition-colors"
                          >
                            Edit
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(scenario._id!)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};