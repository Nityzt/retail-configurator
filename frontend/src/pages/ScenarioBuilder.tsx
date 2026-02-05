import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import type { ScenarioFormData } from '@/types/scenario';
import { toast } from 'sonner';

const initialFormData: ScenarioFormData = {
  name: '',
  salesMultiplier: 1,
  productCategories: [],
  regions: [],
  customerSegments: [],
  dateRange: { start: '', end: '' },
};

export const ScenarioBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createScenario, updateScenario } = useScenarios();

  const [formData, setFormData] = useState<ScenarioFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      // fetch single scenario if needed
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateScenario(id, formData);
        toast.success('Updated scenario!');
      } else {
        await createScenario(formData);
        toast.success('Created scenario!');
      }
      navigate('/'); // go back to list
    } catch (err) {
      toast.error('Failed to save scenario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        placeholder="Scenario Name"
      />
      <button type="submit" disabled={isSubmitting}>
        {isEditMode ? 'Update' : 'Create'}
      </button>
    </form>
  );
};
