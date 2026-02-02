import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useScenarios } from '@/hooks/useScenarios';
import { scenarioApi } from '@/lib/api';
import type { ScenarioFormData } from '@/types/scenario';
import { toast } from 'sonner';
import { PreviewPanel } from '@/components/scenarios/PreviewPanel';

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

export const CreateSection = forwardRef<CreateSectionRef, CreateSectionProps>(
  ({ onSuccess }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { createScenario, updateScenario } = useScenarios();

    const [formData, setFormData] = useState<ScenarioFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof ScenarioFormData | 'dateRange', string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const isEditMode = Boolean(editingId);

    useImperativeHandle(ref, () => ({
      loadScenario: async (id: string) => {
        try {
          const scenario = await scenarioApi.getById(id);
          setFormData({
            name: scenario.name,
            salesMultiplier: scenario.salesMultiplier,
            productCategories: scenario.productCategories,
            regions: scenario.regions,
            customerSegments: scenario.customerSegments,
            dateRange: scenario.dateRange,
          });
          setEditingId(id);
        } catch {
          toast.error('Failed to load');
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

    type ArrayField = 'productCategories' | 'regions' | 'customerSegments';
    const toggleItem = (field: ArrayField, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
      }));
    };

    const generatePreview = () => {
      const startDate = new Date(formData.dateRange.start || new Date());
      const endDate = new Date(formData.dateRange.end || new Date());
      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const salesData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return { date: date.toISOString().split('T')[0], sales: Math.round((1000 + Math.random() * 500) * formData.salesMultiplier) };
      });
      setPreviewData({ salesData });
      setPreviewOpen(true);
    };

    const validate = (): boolean => {
      const newErrors: typeof errors = {};
      if (!formData.name.trim()) newErrors.name = 'Required';
      if (!formData.dateRange.start || !formData.dateRange.end) newErrors.dateRange = 'Required';
      if (formData.productCategories.length === 0) newErrors.productCategories = 'Select one';
      if (formData.regions.length === 0) newErrors.regions = 'Select one';
      if (formData.customerSegments.length === 0) newErrors.customerSegments = 'Select one';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        if (isEditMode && editingId) {
          await updateScenario(editingId, formData);
          toast.success('Updated');
        } else {
          await createScenario(formData);
          toast.success('Created');
        }
        setFormData(initialFormData);
        setEditingId(null);
        onSuccess?.();
      } catch {
        toast.error('Failed');
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
      <div ref={sectionRef} className="h-full w-full bg-black flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-3 sm:mb-4 shrink-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">{isEditMode ? 'Edit Scenario' : 'Create Scenario'}</h2>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4 max-w-md sm:max-w-lg mx-auto">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-md sm:rounded-lg text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-[#f97316]" placeholder="Q4 Holiday Rush" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1">Start</label>
                <input type="date" value={formData.dateRange.start} onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-md sm:rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#f97316]" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1">End</label>
                <input type="date" value={formData.dateRange.end} onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-md sm:rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#f97316]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1">Multiplier: {formData.salesMultiplier}x</label>
              <input type="range" min="0.5" max="3" step="0.1" value={formData.salesMultiplier} onChange={e => setFormData(prev => ({ ...prev, salesMultiplier: parseFloat(e.target.value) }))} className="w-full h-1 sm:h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-3.5 sm:[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#f97316]" />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">Categories</label>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {['Electronics', 'Home', 'Tools', 'Appliances', 'Lighting', 'Paint'].map(cat => (
                  <button key={cat} type="button" onClick={() => toggleItem('productCategories', cat)} className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors ${formData.productCategories.includes(cat) ? 'bg-[#f97316] text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>{cat}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">Regions</label>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'].map(region => (
                  <button key={region} type="button" onClick={() => toggleItem('regions', region)} className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors ${formData.regions.includes(region) ? 'bg-[#f97316] text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>{region}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">Segments</label>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {['New', 'Returning', 'VIP'].map(seg => (
                  <button key={seg} type="button" onClick={() => toggleItem('customerSegments', seg)} className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium transition-colors ${formData.customerSegments.includes(seg) ? 'bg-[#f97316] text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>{seg}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1 sm:pt-2">
              <button type="button" onClick={generatePreview} className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/10 text-white rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium hover:bg-white/20 transition-colors">Preview</button>
              {isEditMode && <button type="button" onClick={handleCancel} className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-400 hover:text-white text-[10px] sm:text-sm font-medium transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className={`flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium transition-colors ${isSubmitting ? 'bg-gray-600' : 'bg-[#f97316] text-white hover:bg-[#ea580c]'}`}>{isSubmitting ? '...' : (isEditMode ? 'Update' : 'Create')}</button>
            </div>
          </form>
        </div>
        <PreviewPanel isOpen={previewOpen} onClose={() => setPreviewOpen(false)} data={previewData} />
      </div>
    );
  }
);

CreateSection.displayName = 'CreateSection';
