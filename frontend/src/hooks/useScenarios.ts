import { useState, useEffect, useCallback } from 'react';
import { scenarioApi } from '@/lib/api';
import type { Scenario, ScenarioFormData } from '@/types/scenario';

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scenarioApi.getAll();
      setScenarios(data);
    } catch (err) {
      console.error("Failed to fetch scenarios:", err);
      setError("Failed to load scenarios");
    } finally {
      setLoading(false);
    }
  }, []);

  const createScenario = async (payload: ScenarioFormData): Promise<Scenario> => {
    const tempScenario: Scenario = { ...payload, _id: 'temp-id' };
    setScenarios(prev => [...prev, tempScenario]);
    try {
      const newScenario = await scenarioApi.create(payload);
      setScenarios(prev => prev.map(s => s._id === 'temp-id' ? newScenario : s));
      return newScenario;
    } catch (err) {
      setScenarios(prev => prev.filter(s => s._id !== 'temp-id'));
      console.error("Failed to create scenario:", err);
      throw new Error("Failed to create scenario");
    }
  };

  const updateScenario = async (id: string, payload: ScenarioFormData): Promise<Scenario> => {
    const prevScenarios = [...scenarios];
    const tempUpdated = { ...payload, _id: id };
    setScenarios(prev => prev.map(s => s._id === id ? tempUpdated : s));
    try {
      const updated = await scenarioApi.update(id, payload);
      setScenarios(prev => prev.map(s => s._id === id ? updated : s));
      return updated;
    } catch (err) {
      setScenarios(prevScenarios); // revert
      console.error("Failed to update scenario:", err);
      throw new Error("Failed to update scenario");
    }
  };

  const deleteScenario = async (id: string): Promise<void> => {
    const prevScenarios = [...scenarios];
    setScenarios(prev => prev.filter(s => s._id !== id));
    try {
      await scenarioApi.delete(id);
    } catch (err) {
      console.error("Failed to delete scenario:", err);
      setScenarios(prevScenarios); // revert
      throw new Error("Failed to delete scenario");
    }
  };
  

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  return {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
    refetch: fetchScenarios,
  };
};
