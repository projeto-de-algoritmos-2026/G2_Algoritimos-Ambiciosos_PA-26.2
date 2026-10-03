import React from 'react';
import { useGameStore } from './store/useGameStore';
import { DashboardPhase } from './views/DashboardPhase';
import { TacticalPhase } from './views/TacticalPhase';
import { TutorialBox } from './components/ui/TutorialBox';

function App() {
  const { currentPhase } = useGameStore();

  return (
    <div className="app-main">
      {currentPhase === 'PHASE_1_DASHBOARD' && <DashboardPhase />}
      {currentPhase === 'PHASE_2_TACTICAL' && <TacticalPhase />}
      <TutorialBox />
    </div>
  );
}

export default App;
