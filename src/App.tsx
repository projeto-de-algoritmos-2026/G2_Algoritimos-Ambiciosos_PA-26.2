import React from 'react';
import { useGameStore } from './store/useGameStore';
import { DashboardPhase } from './views/DashboardPhase';
import { TacticalPhase } from './views/TacticalPhase';

function App() {
  const { currentPhase } = useGameStore();

  return (
    <div className="antialiased selection:bg-sci-accent selection:text-black">
      {currentPhase === 'PHASE_1_DASHBOARD' && <DashboardPhase />}
      {currentPhase === 'PHASE_2_TACTICAL' && <TacticalPhase />}
    </div>
  );
}

export default App;
