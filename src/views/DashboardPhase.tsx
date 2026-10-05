import React from 'react';
import { ContractBoard } from '../components/dashboard/ContractBoard';
import { BlackMarket } from '../components/dashboard/BlackMarket';
import { DropPod } from '../components/dashboard/DropPod';
import { useGameStore } from '../store/useGameStore';
import { Rocket, Users } from 'lucide-react';

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

        <div className="flex align-center gap-3">
          {mercenaries.length > 0 && (
            <div className="badge flex align-center gap-2" style={{ border: '1px solid rgba(0, 255, 136, 0.3)', color: 'var(--color-success)' }}>
              <Users size={14} /> {mercenaries.length} recruta{mercenaries.length > 1 ? 's' : ''}
            </div>
          )}
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
        </div>
      </header>

      <div className="container dashboard-grid">
        <div className="flex-col gap-4">
          <BlackMarket />

          {mercenaries.length > 0 && (
            <div className="sci-panel" style={{ padding: '1rem' }}>
              <h3 className="sci-text-sm sci-text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.75rem', marginTop: 0 }}>
                Seu Esquadrão ({mercenaries.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {mercenaries.map(m => (
                  <div key={m.id} className="badge sci-text-accent" style={{ border: '1px solid rgba(0, 240, 255, 0.2)', padding: '0.35rem 0.75rem' }}>
                    {m.name} <span className="sci-text-muted">({m.role})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-col gap-4">
          <ContractBoard />
          <DropPod />
        </div>
      </div>
    </div>
  );
};
