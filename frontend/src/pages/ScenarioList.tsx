import { useScenarios } from '@/hooks/useScenarios';
import { Link } from 'react-router-dom';

export const ScenarioList = () => {
  const { scenarios, loading, error, deleteScenario } = useScenarios();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await deleteScenario(id);
        alert('Scenario deleted!');
      } catch (err) {
        alert('Failed to delete scenario');
        console.error('Error deleting scenario:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading scenarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a1a1a] via-[#c2410c] to-[#f97316] text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Demo Scenario Configurator</h1>
          <p className="text-xl opacity-90 mb-8">
            Empowering non-technical teams to create data-driven demos
          </p>
          <Link
            to="/new"
            className="inline-block bg-white text-[#f97316] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            + Create New Scenario
          </Link>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Your Scenarios</h2>
        
        {scenarios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No scenarios yet</p>
            <Link to="/new" className="text-[#f97316] hover:underline">
              Create your first scenario
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-[#f97316]"
              >
                <h3 className="text-xl font-semibold mb-2">{scenario.name}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>Sales Multiplier: {scenario.salesMultiplier}x</p>
                  <p>Regions: {scenario.regions.join(', ')}</p>
                  <p>Categories: {scenario.productCategories.length}</p>
                  <p className="text-xs text-gray-400">
                    {scenario.dateRange.start} to {scenario.dateRange.end}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(scenario._id!)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};