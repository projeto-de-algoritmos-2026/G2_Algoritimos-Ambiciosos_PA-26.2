import React from 'react';
import { ContractBoard } from '../components/dashboard/ContractBoard';
import { BlackMarket } from '../components/dashboard/BlackMarket';
import { DropPod } from '../components/dashboard/DropPod';
import { useGameStore } from '../store/useGameStore';
import { Rocket } from 'lucide-react';

export const DashboardPhase: React.FC = () => {
  const { setPhase, mercenaries, inventory, tutorialStep, nextTutorialStep } = useGameStore();
  const isReadyToDeploy = mercenaries.length > 0 && inventory.length > 0;

  return (
    <div className="app-wrapper">
      <header className="page-header container">
        <div>
          <h1 className="page-title">Mother Ship</h1>
          <p className="page-subtitle">Gestão de Guilda</p>
        </div>
        
        <button
          disabled={!isReadyToDeploy}
          onClick={() => {
            setPhase('PHASE_2_TACTICAL');
            if (tutorialStep === 3) nextTutorialStep();
          }}
          className="sci-btn primary"
        >
          <Rocket size={20} /> Deploy para Superfície
        </button>
      </header>

      <div className="container grid-layout">
        <div>
          <BlackMarket />
          
          <div className="sci-panel" style={{ marginTop: '1.5rem', padding: '1rem' }}>
            <h3 className="sci-text-sm sci-text-muted" style={{ textTransform: 'uppercase', marginBottom: '1rem', marginTop: 0 }}>
              Seu Esquadrão
            </h3>
            {mercenaries.length === 0 ? (
              <p className="sci-text-xs sci-text-muted" style={{ margin: 0 }}>Nenhum recruta.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {mercenaries.map(m => (
                  <li key={m.id} className="sci-text-xs sci-text-accent" style={{ backgroundColor: 'rgba(0, 240, 255, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                    {m.name} ({m.role})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex-col gap-4">
          <ContractBoard />
          <DropPod />
        </div>
      </div>
    </div>
  );
};
