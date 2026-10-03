import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GridMap } from '../components/tactical/GridMap';
import { CombatUI } from '../components/tactical/CombatUI';
import { Target, ArrowLeft, Shield } from 'lucide-react';

export const TacticalPhase: React.FC = () => {
  const { setPhase, inventory } = useGameStore();

  const totalCombatValue = inventory.reduce((acc, item) => acc + item.combatValue, 0);

  return (
    <div className="min-h-screen bg-[#050810] p-8 flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0f14] via-sci-dark to-[#000]">
      <header className="w-full max-w-6xl flex justify-between items-end mb-8 border-b border-sci-alert/30 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <Target className="text-sci-alert" size={32} /> Zona de Combate
          </h1>
          <div className="flex gap-4 mt-2 items-center">
            <span className="text-sci-alert text-sm uppercase tracking-widest font-bold flex items-center gap-1">
              <Shield size={16} /> Ameaça: Extrema
            </span>
            <span className="text-blue-400 text-sm uppercase tracking-widest font-bold border-l border-white/10 pl-4">
              Poder do Drop Pod: {totalCombatValue.toFixed(0)} pts
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setPhase('PHASE_1_DASHBOARD')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
        >
          <ArrowLeft size={16} /> Retirar Esquadrão
        </button>
      </header>

      <div className="w-full max-w-6xl space-y-6">
        <GridMap />
        <CombatUI />
      </div>
    </div>
  );
};
