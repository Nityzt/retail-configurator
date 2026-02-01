import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useScenarios } from '@/hooks/useScenarios';
import { scenarioApi } from '@/lib/api';
import type { ScenarioFormData } from '@/types/scenario';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/magnetic-button';
import { staggerContainer, formFieldReveal } from '@/lib/animations';

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
  const [errors, setErrors] = useState<Partial<Record<keyof ScenarioFormData | 'dateRange', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(id);

  // Load scenario data if editing
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      scenarioApi.getById(id)
        .then(scenario => {
          setFormData({
            name: scenario.name,
            salesMultiplier: scenario.salesMultiplier,
            productCategories: scenario.productCategories,
            regions: scenario.regions,
            customerSegments: scenario.customerSegments,
            dateRange: scenario.dateRange,
          });
        })
        .catch(err => {
          console.error('Failed to load scenario:', err);
          toast.error('Failed to load scenario');
          navigate('/');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, navigate]);

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
      if (isEditMode && id) {
        await updateScenario(id, formData);
        toast.success('Scenario updated successfully!');
      } else {
        await createScenario(formData);
        toast.success('Scenario created successfully!');
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save scenario', err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} scenario`);
      setErrors({ name: `Failed to ${isEditMode ? 'update' : 'create'} scenario. Try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          Loading scenario...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="text-[#f97316] hover:underline mb-4"
            whileHover={{ x: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ← Back to Scenarios
          </motion.button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Demo Scenario' : 'Create Demo Scenario'}
          </h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Name */}
          <motion.div variants={formFieldReveal}>
            <label className="block text-sm font-medium mb-2">Scenario Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-colors"
              placeholder="e.g., Q4 Holiday Rush"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Date Range */}
          <motion.div variants={formFieldReveal} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.dateRange.start}
                onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <input
                type="date"
                value={formData.dateRange.end}
                onChange={e => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-colors"
              />
            </div>
            {errors.dateRange && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm col-span-2 mt-1"
              >
                {errors.dateRange}
              </motion.p>
            )}
          </motion.div>

          {/* Sales Multiplier */}
          <motion.div variants={formFieldReveal}>
            <label className="block text-sm font-medium mb-2">
              Sales Volume Multiplier:{' '}
              <motion.span
                key={formData.salesMultiplier}
                initial={{ scale: 1.2, color: '#f97316' }}
                animate={{ scale: 1, color: '#f97316' }}
                className="font-bold"
              >
                {formData.salesMultiplier}x
              </motion.span>
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
          </motion.div>

          {/* Product Categories */}
          <motion.div variants={formFieldReveal}>
            <label className="block text-sm font-medium mb-2">Product Categories *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Electronics', 'Home & Garden', 'Tools', 'Appliances', 'Lighting', 'Paint'].map((category, index) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => toggleItem('productCategories', category)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.productCategories.includes(category)
                      ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316] hover:shadow-md'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            {errors.productCategories && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.productCategories}
              </motion.p>
            )}
          </motion.div>

          {/* Regions */}
          <motion.div variants={formFieldReveal}>
            <label className="block text-sm font-medium mb-2">Regions *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'].map((region, index) => (
                <motion.button
                  key={region}
                  type="button"
                  onClick={() => toggleItem('regions', region)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.regions.includes(region)
                      ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316] hover:shadow-md'
                  }`}
                >
                  {region}
                </motion.button>
              ))}
            </div>
            {errors.regions && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.regions}
              </motion.p>
            )}
          </motion.div>

          {/* Customer Segments */}
          <motion.div variants={formFieldReveal}>
            <label className="block text-sm font-medium mb-2">Customer Segments *</label>
            <div className="grid grid-cols-3 gap-2">
              {['New', 'Returning', 'VIP'].map((segment, index) => (
                <motion.button
                  key={segment}
                  type="button"
                  onClick={() => toggleItem('customerSegments', segment)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.customerSegments.includes(segment)
                      ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#f97316] hover:shadow-md'
                  }`}
                >
                  {segment}
                </motion.button>
              ))}
            </div>
            {errors.customerSegments && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.customerSegments}
              </motion.p>
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div variants={formFieldReveal} className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>

            <MagneticButton
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#f97316] text-white hover:bg-[#ea580c] hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Scenario' : 'Create Scenario')}
            </MagneticButton>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};