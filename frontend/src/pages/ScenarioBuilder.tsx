import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import type { ScenarioFormData } from '@/types/scenario';

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
  const { createScenario } = useScenarios();

  const [formData, setFormData] = useState<ScenarioFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ScenarioFormData | 'dateRange', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  type ArrayField = 'productCategories' | 'regions' | 'customerSegments';

const toggleItem = (field: ArrayField, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: prev[field].includes(value)
      ? prev[field].filter(v => v !== value)
      : [...prev[field], value],
  }));
};


  // Validate form
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) newErrors.name = 'Scenario name is required';
    if (!formData.dateRange.start || !formData.dateRange.end) newErrors.dateRange = 'Start and end dates are required';
    if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one category';
    if (formData.regions.length === 0) newErrors.regions = 'Select at least one region';
    if (formData.customerSegments.length === 0) newErrors.customerSegments = 'Select at least one segment';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createScenario(formData);
      navigate('/');
    } catch (err) {
      console.error('Failed to create scenario', err);
      setErrors({ name: 'Failed to create scenario. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="text-[#f97316] hover:underline mb-4">
            ← Back to Scenarios
          </button>
          <h1 className="text-3xl font-bold">Create Demo Scenario</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Scenario Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              placeholder="e.g., Q4 Holiday Rush"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.dateRange.start}
                onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <input
                type="date"
                value={formData.dateRange.end}
                onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
              />
            </div>
            {errors.dateRange && <p className="text-red-500 text-sm col-span-2 mt-1">{errors.dateRange}</p>}
          </div>

          {/* Sales Multiplier */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sales Volume Multiplier: <span className="text-[#f97316] font-bold">{formData.salesMultiplier}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={formData.salesMultiplier}
              onChange={e => setFormData(prev => ({ ...prev, salesMultiplier: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (0.5x)</span>
              <span>Normal (1x)</span>
              <span>High (3x)</span>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Categories *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Electronics', 'Home & Garden', 'Tools', 'Appliances', 'Lighting', 'Paint'].map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleItem('productCategories', category)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.productCategories.includes(category)
                      ? 'bg-[#f97316] text-white border-[#f97316]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.productCategories && <p className="text-red-500 text-sm mt-1">{errors.productCategories}</p>}
          </div>

          {/* Regions */}
          <div>
            <label className="block text-sm font-medium mb-2">Regions *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'].map(region => (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleItem('regions', region)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.regions.includes(region)
                      ? 'bg-[#f97316] text-white border-[#f97316]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
            {errors.regions && <p className="text-red-500 text-sm mt-1">{errors.regions}</p>}
          </div>

          {/* Customer Segments */}
          <div>
            <label className="block text-sm font-medium mb-2">Customer Segments *</label>
            <div className="grid grid-cols-3 gap-2">
              {['New', 'Returning', 'VIP'].map(segment => (
                <button
                  key={segment}
                  type="button"
                  onClick={() => toggleItem('customerSegments', segment)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.customerSegments.includes(segment)
                      ? 'bg-[#f97316] text-white border-[#f97316]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316]'
                  }`}
                >
                  {segment}
                </button>
              ))}
            </div>
            {errors.customerSegments && <p className="text-red-500 text-sm mt-1">{errors.customerSegments}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#f97316] text-white hover:bg-[#ea580c]'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Scenario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
