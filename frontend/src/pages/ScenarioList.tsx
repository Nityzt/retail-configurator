import { useScenarioContext } from '@/contexts/ScenarioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '@/components/ui/magnetic-button';
import { Skeleton } from '@/components/ui/skeleton';

export const ScenarioList = () => {
  const { scenarios, loading, error, deleteScenario } = useScenarioContext();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {scenarios.map(s => (
          <motion.div
            key={s._id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#f97316]">
              <h3 className="font-bold">{s.name}</h3>
              <p>Sales Multiplier: {s.salesMultiplier}x</p>
              <p>Regions: {s.regions.join(', ')}</p>
              <div className="flex gap-2 mt-2">
                <Link to="#" className="text-[#f97316] hover:underline">
                  Edit
                </Link>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => s._id && deleteScenario(s._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
