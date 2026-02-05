import { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

import { scenarioApi } from '@/lib/api';
import type { ScenarioFormData } from '@/types/scenario';
import { toast } from 'sonner';
import { PreviewPanel } from '@/components/scenarios/PreviewPanel';

import {useScenarioContext} from '@/contexts/ScenarioContext';


const initialFormData: ScenarioFormData = {
  name: '',
  salesMultiplier: 1,
  productCategories: [],
  regions: [],
  customerSegments: [],
  dateRange: { start: '', end: '' },
};

export interface CreateSectionRef {
  loadScenario: (id: string) => void;
  resetForm: () => void;
  scrollIntoView: () => void;
}

interface CreateSectionProps {
  onSuccess?: () => void; // parent can refresh list
}

type Errors = Partial<Record<keyof ScenarioFormData | 'dateRange', string>>;

export const CreateSection = forwardRef<CreateSectionRef, CreateSectionProps>(
  ({ onSuccess }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { createScenario, updateScenario } = useScenarioContext();

    const [formData, setFormData] = useState<ScenarioFormData>(initialFormData);
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<{ salesData: { date: string; sales: number }[] } | undefined>(undefined);

    const isEditMode = Boolean(editingId);

    /** Expose imperative functions to parent via ref */
    useImperativeHandle(ref, () => ({
      loadScenario: async (id: string) => {
        try {
          const scenario = await scenarioApi.getById(id);
          const {_id, ...rest} = scenario;
          setFormData( rest );
          setEditingId(id);
        } catch {
          toast.error('Failed to load scenario');
        }
      },
      resetForm: () => {
        setFormData(initialFormData);
        setEditingId(null);
        setErrors({});
      },
      scrollIntoView: () => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
    }));

    /** Toggle items for array fields */
    type ArrayField = 'productCategories' | 'regions' | 'customerSegments';
    const toggleItem = useCallback((field: ArrayField, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value],
      }));
    }, []);

    /** Generate preview data */
    const generatePreview = useCallback(() => {
      const startDate = formData.dateRange.start ? new Date(formData.dateRange.start) : new Date();
      const endDate = formData.dateRange.end ? new Date(formData.dateRange.end) : new Date();
      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const salesData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          sales: Math.round((1000 + Math.random() * 500) * formData.salesMultiplier),
        };
      });
      setPreviewData({ salesData });
    }, [formData.dateRange, formData.salesMultiplier]);

    /** Validate form */
    const validate = (): boolean => {
      const newErrors: Errors = {};

      if (!formData.name.trim()) newErrors.name = 'Required';
      if (!formData.dateRange.start || !formData.dateRange.end) {
        newErrors.dateRange = 'Required';
      } else if (new Date(formData.dateRange.start) > new Date(formData.dateRange.end)) {
        newErrors.dateRange = 'Start date must be before end date';
      }
      if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one';
      if (formData.regions.length === 0) newErrors.regions = 'Select at least one';
      if (formData.customerSegments.length === 0) newErrors.customerSegments = 'Select at least one';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    /** Handle form submit */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      if (!validate()) return;
    
      setIsSubmitting(true);
      try {
        // Send date strings exactly as the backend expects (YYYY-MM-DD)
        const payload = {
          ...formData,
          dateRange: {
            start: formData.dateRange.start,
            end: formData.dateRange.end ,
          },
        };
    
        if (isEditMode && editingId) {
          await updateScenario(editingId, payload);
          toast.success('Scenario updated');
        } else {
          await createScenario(payload);
          toast.success('Scenario created');
        }
    
        setFormData(initialFormData);
        setEditingId(null);
        setErrors({});
        onSuccess?.(); // refresh parent list
      } catch {
        toast.error('Failed to submit scenario');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    

    const handleCancel = () => {
      setFormData(initialFormData);
      setEditingId(null);
      setErrors({});
    };

    return (
      <div ref={sectionRef} className="h-full w-full bg-black flex flex-col p-[3vw] sm:p-6 lg:p-8 relative">
        <PreviewPanel data={previewData} onGeneratePreview={generatePreview} />

        <div className="text-center mb-[2vw] sm:mb-4 shrink-0">
          <h2 className="text-[5vw] sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {isEditMode ? 'Edit Scenario' : 'Create Scenario'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-[2vw] sm:rounded-xl p-[3vw] sm:p-5 space-y-[2vw] sm:space-y-4 max-w-md sm:max-w-lg mx-auto"
          >
            {/* Name */}
            <div>
              <label className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-[2vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316]"
                placeholder="Q4 Holiday Rush"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-[2vw] sm:gap-3">
              <div>
                <label className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1">
                  Start
                </label>
                <input
                  type="date"
                  value={formData.dateRange.start}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))
                  }
                  className="w-full px-[1.5vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm focus:outline-none focus:border-[#f97316]"
                />
              </div>
              <div>
                <label className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1">
                  End
                </label>
                <input
                  type="date"
                  value={formData.dateRange.end}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))
                  }
                  className="w-full px-[1.5vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>
            {errors.dateRange && <p className="text-red-500 text-xs mt-1">{errors.dateRange}</p>}

            {/* Sales multiplier */}
            <div>
              <label className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1">
                Multiplier: {formData.salesMultiplier}x
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={formData.salesMultiplier}
                onChange={e => setFormData(prev => ({ ...prev, salesMultiplier: parseFloat(e.target.value) }))}
                className="w-full h-[0.8vw] sm:h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[2.5vw] [&::-webkit-slider-thumb]:h-[2.5vw] sm:[&::-webkit-slider-thumb]:w-3.5 sm:[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#f97316]"
              />
            </div>

            {/* Array fields: categories, regions, segments */}
            {(['productCategories', 'regions', 'customerSegments'] as ArrayField[]).map(field => (
              <div key={field}>
                <label className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[1vw] sm:mb-2">
                  {field === 'productCategories'
                    ? 'Categories'
                    : field === 'regions'
                    ? 'Regions'
                    : 'Segments'}
                </label>
                <div className="flex flex-wrap gap-[1vw] sm:gap-1.5">
                  {(field === 'productCategories'
                    ? ['Electronics', 'Home', 'Tools', 'Appliances', 'Lighting', 'Paint']
                    : field === 'regions'
                    ? ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West']
                    : ['New', 'Returning', 'VIP']
                  ).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleItem(field, option)}
                      aria-pressed={formData[field].includes(option)}
                      className={`px-[2vw] sm:px-2.5 py-[0.8vw] sm:py-1 rounded-[0.8vw] sm:rounded text-[2.2vw] sm:text-xs font-medium transition-colors ${
                        formData[field].includes(option)
                          ? 'bg-[#f97316] text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            {/* Buttons */}
            <div className="flex gap-[2vw] sm:gap-2 pt-[1vw] sm:pt-2">
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-[2vw] sm:px-3 py-[1.5vw] sm:py-2 text-gray-400 hover:text-white text-[2.5vw] sm:text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-[2vw] sm:px-3 py-[1.5vw] sm:py-2 rounded-[1vw] sm:rounded-lg text-[2.5vw] sm:text-sm font-medium transition-colors ${
                  isSubmitting ? 'bg-gray-600' : 'bg-[#f97316] text-white hover:bg-[#ea580c]'
                }`}
              >
                {isSubmitting ? '...' : isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

CreateSection.displayName = 'CreateSection';
