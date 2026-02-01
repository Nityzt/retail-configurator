import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ScenarioList } from './pages/ScenarioList';
import { ScenarioBuilder } from './pages/ScenarioBuilder';
import { useLenis } from './hooks/useLenis';
import { Toaster } from 'sonner';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ScenarioList />} />
        <Route path="/new" element={<ScenarioBuilder />} />
        <Route path="/edit/:id" element={<ScenarioBuilder />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useLenis(); // Initialize smooth scroll

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
