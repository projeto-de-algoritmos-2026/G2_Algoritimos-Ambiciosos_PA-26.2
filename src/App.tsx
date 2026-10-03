import React from 'react';
import { useGameStore } from './store/useGameStore';
import { DashboardPhase } from './views/DashboardPhase';
// Importação mockada da Fase 2 (vamos implementar no Passo 4)
const TacticalPhase = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
    <h1 className="text-4xl text-sci-alert font-black mb-4 uppercase tracking-widest">Aviso de Combate</h1>
    <p className="text-gray-400">Componente TacticalPhase sendo construído (Passo 4)...</p>
    <button 
      className="mt-8 bg-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-700"
      onClick={() => useGameStore.getState().setPhase('PHASE_1_DASHBOARD')}
    >
      Abortar Missão (Voltar)
    </button>
  </div>
);

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
