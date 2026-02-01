// frontend/src/components/scenarios/PreviewPanel.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesPoint {
    date: string;
    sales: number;
  }
  
  interface PreviewData {
    salesData: SalesPoint[];
  }
  

interface PreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: PreviewData;
}



export const PreviewPanel = ({ isOpen, onClose, data }: PreviewPanelProps) => {
  return (

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full md:w-1/2 bg-background border-l shadow-2xl overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Data Preview</h2>
              <button onClick={onClose}
              aria-label="Close preview panel">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                {(!data || data.salesData.length === 0) ? (
                    <p className="text-sm text-muted-foreground">
                        No data available for this scenario.
                        </p>) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};