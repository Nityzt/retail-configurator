import { useState, useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';

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
  onSuccess?: () => void;
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
        setPreviewData(undefined); // Clear preview on reset
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

    /** Generate preview data - IMPROVED VERSION */
    const generatePreview = useCallback(() => {
      // Default to 30-day period from today if dates not set
      const today = new Date();
      const defaultEnd = new Date();
      defaultEnd.setDate(defaultEnd.getDate() + 30);

      const startDate = formData.dateRange.start 
        ? new Date(formData.dateRange.start) 
        : today;
      const endDate = formData.dateRange.end 
        ? new Date(formData.dateRange.end) 
        : defaultEnd;

      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const dataPoints = Math.min(days, 30); // Limit to 30 points for chart readability

      const salesData = Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          sales: Math.round((1000 + Math.random() * 500) * formData.salesMultiplier),
        };
      });
      setPreviewData({ salesData });
    }, [formData.dateRange, formData.salesMultiplier]);

    /** Auto-generate preview when dates or multiplier change - OPTION 1: AUTO-PREVIEW */
    useEffect(() => {
      // Only auto-generate if we have dates OR if editing a scenario
      if ((formData.dateRange.start && formData.dateRange.end) || editingId) {
        generatePreview();
      }
    }, [formData.dateRange.start, formData.dateRange.end, formData.salesMultiplier, generatePreview, editingId]);

    /** Validate form */
    const validate = (): boolean => {
      const newErrors: Errors = {};
    
      const name = formData.name.trim();
    
      if (!name) {
        newErrors.name = 'Required';
      } else if (name.length < 3) {
        newErrors.name = 'Must be at least 3 characters';
      }
    
      if (!formData.dateRange.start || !formData.dateRange.end) {
        newErrors.dateRange = 'Required';
      } else if (
        new Date(formData.dateRange.start) > new Date(formData.dateRange.end)
      ) {
        newErrors.dateRange = 'Start date must be before end date';
      }
    
      if (formData.productCategories.length === 0)
        newErrors.productCategories = 'Select at least one';
    
      if (formData.regions.length === 0)
        newErrors.regions = 'Select at least one';
    
      if (formData.customerSegments.length === 0)
        newErrors.customerSegments = 'Select at least one';
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    /** Handle form submit */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      if (!validate()) return;
    
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          dateRange: {
            start: formData.dateRange.start,
            end: formData.dateRange.end,
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
        setPreviewData(undefined); // Clear preview after submit
        onSuccess?.();
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
      setPreviewData(undefined); // Clear preview on cancel
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
            aria-label={isEditMode ? 'Edit scenario form' : 'Create scenario form'}
          >
            {/* Name */}
            <div>
              <label 
                htmlFor="scenario-name"
                className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1"
              >
                Name
              </label>
              <input
                id="scenario-name"
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-[2vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316]"
                placeholder="Boxing Day Blitz"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>

            {/* Dates */}
            <fieldset>
              <legend className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[1vw] sm:mb-2">
                Date Range
              </legend>
              <div className="grid grid-cols-2 gap-[2vw] sm:gap-3">
                <div>
                  <label 
                    htmlFor="start-date"
                    className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1"
                  >
                    Start
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={formData.dateRange.start}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))
                    }
                    className="w-full px-[1.5vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm focus:outline-none focus:border-[#f97316]"
                    aria-required="true"
                    aria-invalid={!!errors.dateRange}
                    aria-describedby={errors.dateRange ? "daterange-error" : undefined}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="end-date"
                    className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1"
                  >
                    End
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={formData.dateRange.end}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))
                    }
                    className="w-full px-[1.5vw] sm:px-3 py-[1.5vw] sm:py-2 bg-white/10 border border-white/20 rounded-[1vw] sm:rounded-lg text-white text-[2.5vw] sm:text-sm focus:outline-none focus:border-[#f97316]"
                    aria-required="true"
                    aria-invalid={!!errors.dateRange}
                    aria-describedby={errors.dateRange ? "daterange-error" : undefined}
                  />
                </div>
              </div>
              {errors.dateRange && <p id="daterange-error" className="text-red-500 text-xs mt-1" role="alert">{errors.dateRange}</p>}
            </fieldset>

            {/* Sales multiplier */}
            <div>
              <label 
                htmlFor="sales-multiplier"
                className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[0.5vw] sm:mb-1"
              >
                Multiplier: {formData.salesMultiplier}x
              </label>
              <input
                id="sales-multiplier"
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={formData.salesMultiplier}
                onChange={e => setFormData(prev => ({ ...prev, salesMultiplier: parseFloat(e.target.value) }))}
                className="w-full h-[0.8vw] sm:h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[2.5vw] [&::-webkit-slider-thumb]:h-[2.5vw] sm:[&::-webkit-slider-thumb]:w-3.5 sm:[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#f97316]"
                aria-label={`Sales multiplier: ${formData.salesMultiplier}x`}
                aria-valuemin={0.5}
                aria-valuemax={3}
                aria-valuenow={formData.salesMultiplier}
              />
            </div>

            {/* Array fields: categories, regions (CANADIAN PROVINCES), segments */}
            {(['productCategories', 'regions', 'customerSegments'] as ArrayField[]).map(field => (
              <fieldset key={field}>
                <legend className="block text-[2.5vw] sm:text-xs font-medium text-gray-400 mb-[1vw] sm:mb-2">
                  {field === 'productCategories'
                    ? 'Categories'
                    : field === 'regions'
                    ? 'Provinces/Regions'
                    : 'Segments'}
                </legend>
                <div 
                  className="flex flex-wrap gap-[1vw] sm:gap-1.5"
                  role="group"
                  aria-label={field === 'productCategories'
                    ? 'Product categories selection'
                    : field === 'regions'
                    ? 'Provinces and regions selection'
                    : 'Customer segments selection'}
                  aria-required="true"
                  aria-invalid={!!errors[field]}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                >
                  {(field === 'productCategories'
                    ? ['Electronics', 'Home', 'Tools', 'Appliances', 'Lighting', 'Paint']
                    : field === 'regions'
                    ? ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba']
                    : ['New', 'Returning', 'VIP']
                  ).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleItem(field, option)}
                      aria-pressed={formData[field].includes(option)}
                      aria-label={`${formData[field].includes(option) ? 'Remove' : 'Add'} ${option}`}
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
                {errors[field] && <p id={`${field}-error`} className="text-red-500 text-xs mt-1" role="alert">{errors[field]}</p>}
              </fieldset>
            ))}

            {/* Buttons */}
            <div className="flex gap-[2vw] sm:gap-2 pt-[1vw] sm:pt-2">
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-[2vw] sm:px-3 py-[1.5vw] sm:py-2 text-gray-400 hover:text-white text-[2.5vw] sm:text-sm font-medium transition-colors"
                  aria-label="Cancel editing"
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
                aria-label={isSubmitting ? 'Submitting...' : (isEditMode ? 'Update scenario' : 'Create scenario')}
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