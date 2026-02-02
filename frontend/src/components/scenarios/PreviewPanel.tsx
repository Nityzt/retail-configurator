import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PerspectiveText } from '@/components/ui/PerspectiveText';

interface SalesPoint {
  date: string;
  sales: number;
}

interface PreviewData {
  salesData: SalesPoint[];
}

// New API props
interface NewPreviewPanelProps {
  data?: PreviewData;
  onGeneratePreview: () => void;
  isOpen?: never;
  onClose?: never;
}

// Legacy API props (for backwards compatibility)
interface LegacyPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: PreviewData;
  onGeneratePreview?: never;
}

type PreviewPanelProps = NewPreviewPanelProps | LegacyPreviewPanelProps;

export const PreviewPanel = (props: PreviewPanelProps) => {
  // Check if using legacy API
  const isLegacyMode = 'isOpen' in props && props.isOpen !== undefined;
  
  const [internalActive, setInternalActive] = useState(false);
  
  const isActive = isLegacyMode ? props.isOpen : internalActive;
  
  const handleToggle = () => {
    if (isLegacyMode) {
      props.onClose?.();
    } else {
      if (!internalActive && props.onGeneratePreview) {
        props.onGeneratePreview();
      }
      setInternalActive(!internalActive);
    }
  };

  // Legacy mode - render as overlay
  if (isLegacyMode) {
    return (
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={props.onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(480px,90vw)] h-[min(600px,80vh)] bg-black border border-white/20 rounded-2xl z-50 overflow-hidden"
            >
              <div className="h-full flex flex-col p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6 shrink-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Data Preview</h2>
                  <button onClick={props.onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <span className="text-white text-xl">&times;</span>
                  </button>
                </div>
                <PreviewContent data={props.data} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // New mode - render as expandable button/panel
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-50">
      <motion.div
        className="bg-black border border-white/20 rounded-2xl relative overflow-hidden"
        animate={isActive ? {
          width: "min(480px, 90vw)",
          height: "min(600px, 80vh)",
          top: "-25px",
          right: "-25px",
        } : {
          width: "120px",
          height: "40px",
          top: "0px",
          right: "0px",
        }}
        initial={{
          width: "120px",
          height: "40px",
          top: "0px",
          right: "0px",
        }}
        transition={isActive ? {
          duration: 0.75,
          ease: [0.76, 0, 0.24, 1]
        } : {
          duration: 0.75,
          // delay: 0.35,
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="h-full flex flex-col p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6 shrink-0">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Data Preview</h2>
              </div>
              <PreviewContent data={props.data} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <button
        onClick={handleToggle}
        className="perspective-btn absolute top-0 right-0 w-30 h-10 bg-white/10 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer transition-colors border border-white/20 flex items-center justify-center"
      >
        <span className="text-white text-xs font-medium">
          <PerspectiveText>{isActive ? "Close" : "Preview"}</PerspectiveText>
        </span>
      </button>
    </div>
  );
};

// Shared content component
const PreviewContent = ({ data }: { data?: PreviewData }) => (
  <div className="flex-1 min-h-0">
    <h3 className="text-sm sm:text-base font-medium text-gray-400 mb-3 sm:mb-4">Sales Trend</h3>
    {(!data || data.salesData.length === 0) ? (
      <div className="flex items-center justify-center h-50 sm:h-75">
        <p className="text-xs sm:text-sm text-gray-500">
          No data available for this scenario.
        </p>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            tickFormatter={(value) => value.slice(5)}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(0,0,0,0.9)", 
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#fff"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#f97316" 
            strokeWidth={2}
            dot={{ fill: "#f97316", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#f97316" }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);
