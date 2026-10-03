import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { optimizeDropPod } from '../../algorithms/dropPod';
import type { PodItem } from '../../algorithms/dropPod';
import { Package, Zap, Scale, ArrowRight } from 'lucide-react';

const availableItems: PodItem[] = [
  { id: 'item1', name: 'Munição AP', weight: 10, combatValue: 60 },
  { id: 'item2', name: 'Rações Extras', weight: 20, combatValue: 100 },
  { id: 'item3', name: 'Kit Médico', weight: 30, combatValue: 120 },
];

export const DropPod: React.FC = () => {
  const { addInventoryItem } = useGameStore();
  const [loadout, setLoadout] = useState<ReturnType<typeof optimizeDropPod> | null>(null);
  const maxWeight = 50;

  const handleOptimize = () => {
    const result = optimizeDropPod(availableItems, maxWeight);
    setLoadout(result);
    
    result.selectedItems.forEach(({ item, fraction }) => {
      addInventoryItem({
        id: item.id,
        name: fraction < 1 ? `${item.name} (${(fraction * 100).toFixed(0)}%)` : item.name,
        weight: item.weight * fraction,
        combatValue: item.combatValue * fraction
      });
    });
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title">
          <Package size={20} /> Drop Pod Loadout
        </h2>
        <div className="badge">Max: {maxWeight}kg</div>
      </div>

      <p className="sci-desc">
        Algoritmo da Mochila Fracionária: Maximiza o valor de combate por peso.
      </p>

      <button
        onClick={handleOptimize}
        className="sci-btn primary"
        style={{ width: '100%', marginBottom: '1.5rem' }}
      >
        <Zap size={16} /> Preencher Drop Pod
      </button>

      {loadout && (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(0, 150, 255, 0.3)' }}>
          <h3 className="flex-between sci-text-sm" style={{ color: '#60a5fa', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <span>Conteúdo da Cápsula</span>
            <span>Total: {loadout.totalValue.toFixed(0)} pts</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loadout.selectedItems.map((entry, idx) => (
              <li key={idx} className="flex-between sci-text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                <span className="flex align-center gap-2">
                  <ArrowRight size={12} className="sci-text-accent" />
                  {entry.item.name} {(entry.fraction < 1) && <span className="sci-text-yellow">({(entry.fraction * 100).toFixed(0)}%)</span>}
                </span>
                <span className="flex gap-3">
                  <span className="sci-text-muted flex align-center gap-2"><Scale size={10}/> {(entry.item.weight * entry.fraction).toFixed(1)}kg</span>
                  <span style={{ color: '#93c5fd' }}>{(entry.item.combatValue * entry.fraction).toFixed(0)} pts</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
