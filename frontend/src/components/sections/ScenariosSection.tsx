import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { Scenario } from '@/types/scenario';
import MagneticButton from '@/components/ui/magnetic-button';
import { PerspectiveText } from '@/components/ui/PerspectiveText';
import { useScenarioContext } from '@/contexts/ScenarioContext';

interface ScenariosSectionProps {
  onCreateClick: () => void;
  onEditClick: (id: string) => void;
}

const ScenarioCard = ({ 
  scenario, 
  onEdit, 
  onDelete,
  index 
}: { 
  scenario: Scenario; 
  onEdit: () => void; 
  onDelete: () => void;
  index: number;
}) => (
  <motion.div 
    className="bg-white/5 border border-white/10 p-[3vw] sm:p-4 rounded-[2vw] sm:rounded-xl hover:bg-white/8 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-50px" }}
    transition={{
      duration: 0.4,
      delay: index * 0.1, // Stagger delay based on index
      ease: "easeOut"
    }}
  >
    <div className="flex justify-between items-start mb-[1.5vw] sm:mb-2">
      <h3 className="text-[3vw] sm:text-sm font-medium text-white truncate flex-1 mr-2">{scenario.name}</h3>
      <span className="px-[1.5vw] sm:px-2 py-[0.5vw] sm:py-0.5 bg-[#f97316]/20 text-[#f97316] text-[2.5vw] sm:text-xs rounded-full shrink-0">{scenario.salesMultiplier}x</span>
    </div>
    <div className="text-gray-500 text-[2.5vw] sm:text-xs mb-[2vw] sm:mb-3 space-y-[0.5vw] sm:space-y-0.5">
      <p className="truncate">{scenario.regions.join(', ')}</p>
      <p>{scenario.productCategories.length} categories</p>
    </div>
    <div className="flex gap-[1.5vw] sm:gap-2">
      <button 
        onClick={onEdit} 
        className="flex-1 px-[2vw] sm:px-3 py-[1vw] sm:py-1.5 bg-white/10 text-white rounded-[1vw] sm:rounded-lg hover:bg-white/20 transition-colors text-[2.5vw] sm:text-xs font-medium"
        aria-label={`Edit ${scenario.name} scenario`}
      >
        Edit
      </button>
      <button 
        onClick={onDelete} 
        className="px-[2vw] sm:px-3 py-[1vw] sm:py-1.5 text-red-400 hover:bg-red-500/10 rounded-[1vw] sm:rounded-lg transition-colors text-[2.5vw] sm:text-xs font-medium"
        aria-label={`Delete ${scenario.name} scenario`}
      >
        Delete
      </button>
    </div>
  </motion.div>
);

const CardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 p-[3vw] sm:p-4 rounded-[2vw] sm:rounded-xl space-y-[2vw] sm:space-y-3">
    <Skeleton className="h-[2.5vw] sm:h-4 w-3/4 bg-white/10" />
    <Skeleton className="h-[2vw] sm:h-3 w-1/2 bg-white/10" />
  </div>
);

export const ScenariosSection = ({ onCreateClick, onEditClick }: ScenariosSectionProps) => {
  const { scenarios, loading, deleteScenario } = useScenarioContext();

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this scenario?')) {
      try {
        await deleteScenario(id);
        toast.success('Deleted');
      } catch {
        toast.error('Failed');
      }
    }
  };

  return (
    <div className="h-full w-full bg-black flex flex-col p-[3vw] sm:p-6 lg:p-8">
      <div className="text-center mb-[3vw] sm:mb-6 shrink-0">
        <h2 className="text-[5vw] sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-[2vw] sm:mb-4">Scenarios</h2>
        <MagneticButton 
          onClick={onCreateClick}
          className="perspective-btn px-[4vw] sm:px-5 py-[2vw] sm:py-2.5 h-auto bg-[#f97316] hover:bg-[#ea580c] rounded-full overflow-hidden cursor-pointer transition-colors"
          aria-label="Create new scenario"
        >
          <span className="text-white text-[2.5vw] sm:text-sm font-medium">
            <PerspectiveText>+ Create New</PerspectiveText>
          </span>
        </MagneticButton>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2vw] sm:gap-3 max-w-4xl mx-auto"
            role="status"
            aria-label="Loading scenarios"
          >
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : scenarios.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-[3vw] sm:text-sm">No scenarios yet</p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2vw] sm:gap-3 max-w-4xl mx-auto"
            role="list"
            aria-label="Available scenarios"
          >
            {scenarios.map((scenario, index) => (
              <div key={scenario._id} role="listitem">
                <ScenarioCard 
                  scenario={scenario} 
                  onEdit={() => onEditClick(scenario._id!)} 
                  onDelete={() => handleDelete(scenario._id!)}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};