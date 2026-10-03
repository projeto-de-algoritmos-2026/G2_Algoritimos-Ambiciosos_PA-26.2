import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GridMap } from '../components/tactical/GridMap';
import { CombatUI } from '../components/tactical/CombatUI';
import { Target, ArrowLeft, Shield } from 'lucide-react';

export const TacticalPhase: React.FC = () => {
  const { setPhase, inventory } = useGameStore();

  const totalCombatValue = inventory.reduce((acc, item) => acc + item.combatValue, 0);

  return (
    <div className="app-wrapper" style={{ backgroundImage: 'radial-gradient(ellipse at top, var(--color-panel), var(--color-dark), #000)' }}>
      <header className="page-header container" style={{ borderColor: 'rgba(255, 42, 42, 0.3)' }}>
        <div>
          <h1 className="page-title flex align-center gap-3">
            <Target className="sci-text-alert" size={32} /> Zona de Combate
          </h1>
          <div className="flex align-center gap-4 mt-2">
            <span className="page-subtitle sci-text-alert flex align-center gap-2" style={{ fontWeight: 'bold' }}>
              <Shield size={16} /> Ameaça: Extrema
            </span>
            <span className="page-subtitle" style={{ color: '#60a5fa', fontWeight: 'bold', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
              Poder do Drop Pod: {totalCombatValue.toFixed(0)} pts
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setPhase('PHASE_1_DASHBOARD')}
          className="sci-btn"
          style={{ color: 'var(--color-text-muted)', border: '1px solid transparent' }}
        >
          <ArrowLeft size={16} /> Retirar Esquadrão
        </button>
      </header>

      <div className="container flex-col gap-4">
        <GridMap />
        <CombatUI />
      </div>
    </div>
  );
};
