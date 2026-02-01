// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScenarioList } from './pages/ScenarioList';
import { ScenarioBuilder } from './pages/ScenarioBuilder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScenarioList />} />
        <Route path="/new" element={<ScenarioBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;