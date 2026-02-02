import { useScenarios } from '@/hooks/useScenarios';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Scenario } from '@/types/scenario';

interface ScenariosSectionProps {
  onCreateClick: () => void;
  onEditClick: (id: string) => void;
}

const ScenarioCard = ({ scenario, onEdit, onDelete }: { scenario: Scenario; onEdit: () => void; onDelete: () => void }) => (
  <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/[0.08] transition-colors">
    <div className="flex justify-between items-start mb-1.5 sm:mb-2">
      <h3 className="text-xs sm:text-sm font-medium text-white truncate flex-1 mr-2">{scenario.name}</h3>
      <span className="px-1.5 sm:px-2 py-0.5 bg-[#f97316]/20 text-[#f97316] text-[10px] sm:text-xs rounded-full shrink-0">{scenario.salesMultiplier}x</span>
    </div>
    <div className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3 space-y-0.5">
      <p className="truncate">{scenario.regions.join(', ')}</p>
      <p>{scenario.productCategories.length} categories</p>
    </div>
    <div className="flex gap-1.5 sm:gap-2">
      <button onClick={onEdit} className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 text-white rounded-md sm:rounded-lg hover:bg-white/20 transition-colors text-[10px] sm:text-xs font-medium">Edit</button>
      <button onClick={onDelete} className="px-2 sm:px-3 py-1 sm:py-1.5 text-red-400 hover:bg-red-500/10 rounded-md sm:rounded-lg transition-colors text-[10px] sm:text-xs font-medium">Delete</button>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl space-y-2 sm:space-y-3">
    <Skeleton className="h-3 sm:h-4 w-3/4 bg-white/10" />
    <Skeleton className="h-2 sm:h-3 w-1/2 bg-white/10" />
  </div>
);

export const ScenariosSection = ({ onCreateClick, onEditClick }: ScenariosSectionProps) => {
  const { scenarios, loading, deleteScenario } = useScenarios();

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
    <div className="h-full w-full bg-black flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-4 sm:mb-6 shrink-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3 sm:mb-4">Scenarios</h2>
        <button onClick={onCreateClick} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#f97316] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-[#ea580c] transition-colors">
          + Create New
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : scenarios.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-xs sm:text-sm">No scenarios yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario._id} scenario={scenario} onEdit={() => onEditClick(scenario._id!)} onDelete={() => handleDelete(scenario._id!)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
