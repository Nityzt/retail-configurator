import { createContext, useContext, useState, useEffect, useCallback} from 'react';
import type { ReactNode } from 'react';
import { scenarioApi } from '@/lib/api';
import type { Scenario, ScenarioFormData } from '@/types/scenario';

interface ScenarioContextType {
  scenarios: Scenario[];
  loading: boolean;
  error: string | null;
  createScenario: (payload: ScenarioFormData) => Promise<Scenario>;
  updateScenario: (id: string, payload: ScenarioFormData) => Promise<Scenario>;
  deleteScenario: (id: string) => Promise<void>;
  refetch: () => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export const useScenarioContext = () => {
  const context = useContext(ScenarioContext);
  if (!context) throw new Error('useScenarioContext must be used within a ScenarioProvider');
  return context;
};

export const ScenarioProvider = ({ children }: { children: ReactNode }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scenarioApi.getAll();
      setScenarios(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const createScenario = async (payload: ScenarioFormData) => {
    const temp: Scenario = { ...payload, _id: 'temp-id' };
    setScenarios(prev => [...prev, temp]);
    try {
      const newScenario = await scenarioApi.create(payload);
      setScenarios(prev => prev.map(s => s._id === 'temp-id' ? newScenario : s));
      return newScenario;
    } catch (err) {
      setScenarios(prev => prev.filter(s => s._id !== 'temp-id'));
      throw err;
    }
  };

  const updateScenario = async (id: string, payload: ScenarioFormData) => {
    const prevScenarios = [...scenarios];
    const temp = { ...payload, _id: id };
    setScenarios(prev => prev.map(s => s._id === id ? temp : s));
    try {
      const updated = await scenarioApi.update(id, payload);
      setScenarios(prev => prev.map(s => s._id === id ? updated : s));
      return updated;
    } catch (err) {
      setScenarios(prevScenarios);
      throw err;
    }
  };

  const deleteScenario = async (id: string) => {
    const prevScenarios = [...scenarios];
    setScenarios(prev => prev.filter(s => s._id !== id));
    try {
      await scenarioApi.delete(id);
    } catch (err) {
      setScenarios(prevScenarios);
      throw err;
    }
  };

  return (
    <ScenarioContext.Provider
      value={{ scenarios, loading, error, createScenario, updateScenario, deleteScenario, refetch: fetchScenarios }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};
