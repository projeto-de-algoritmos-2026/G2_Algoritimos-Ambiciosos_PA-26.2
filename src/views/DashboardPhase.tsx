import React from 'react';
import { ContractBoard } from '../components/dashboard/ContractBoard';
import { BlackMarket } from '../components/dashboard/BlackMarket';
import { DropPod } from '../components/dashboard/DropPod';
import { useGameStore } from '../store/useGameStore';
import { Rocket } from 'lucide-react';

export const DashboardPhase: React.FC = () => {
  const { setPhase, mercenaries, inventory } = useGameStore();

  const isReadyToDeploy = mercenaries.length > 0 && inventory.length > 0;

  return (
    <div className="min-h-screen bg-sci-dark p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl flex justify-between items-end mb-8 border-b border-sci-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Mother Ship</h1>
          <p className="text-sci-accent text-sm uppercase tracking-widest mt-1">Gestão de Guilda</p>
        </div>
        
        <button
          disabled={!isReadyToDeploy}
          onClick={() => setPhase('PHASE_2_TACTICAL')}
          className={`flex items-center gap-2 px-6 py-3 font-bold rounded uppercase tracking-wider transition-all
            ${isReadyToDeploy 
              ? 'bg-sci-accent text-black hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(0,240,255,0.5)]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
        >
          <Rocket size={20} /> Deploy para Superfície
        </button>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <BlackMarket />
          
          <div className="mt-6 bg-black/40 border border-white/10 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Seu Esquadrão</h3>
            {mercenaries.length === 0 ? (
              <p className="text-xs text-gray-600">Nenhum recruta.</p>
            ) : (
              <ul className="space-y-1">
                {mercenaries.map(m => (
                  <li key={m.id} className="text-xs text-sci-accent bg-sci-accent/10 p-1.5 rounded">{m.name} ({m.role})</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-6">
          <ContractBoard />
          <DropPod />
        </div>
      </div>
    </div>
  );
};
