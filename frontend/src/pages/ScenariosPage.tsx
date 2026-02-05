import { Routes, Route } from 'react-router-dom';
import { ScenarioList } from './ScenarioList';
import { ScenarioBuilder } from './ScenarioBuilder';

export const ScenariosPage = () => {
  return (
    <Routes>
      {/* List all scenarios */}
      <Route path="/" element={<ScenarioList />} />

      {/* Create new scenario */}
      <Route path="/new" element={<ScenarioBuilder />} />

      {/* Edit existing scenario */}
      <Route path="/edit/:id" element={<ScenarioBuilder />} />
    </Routes>
  );
};
