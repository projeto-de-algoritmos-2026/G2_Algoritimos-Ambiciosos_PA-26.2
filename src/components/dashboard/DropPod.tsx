import React, { useState } from 'react';
import { useGameStore, InventoryItem } from '../../store/useGameStore';
import { optimizeDropPod, PodItem } from '../../algorithms/dropPod';
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
    
    // Adiciona ao inventário global
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
    <div className="bg-sci-panel border border-sci-border p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sci-accent flex items-center gap-2">
          <Package size={20} /> Drop Pod Loadout
        </h2>
        <div className="text-xs font-bold text-gray-400 bg-black/40 px-2 py-1 rounded">
          Max: {maxWeight}kg
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Algoritmo da Mochila Fracionária: Maximiza o valor de combate por peso.
      </p>

      <button
        onClick={handleOptimize}
        className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-4 py-2 rounded transition-colors text-sm font-semibold flex justify-center items-center gap-2 mb-4"
      >
        <Zap size={16} /> Preencher Drop Pod
      </button>

      {loadout && (
        <div className="bg-black/40 p-3 rounded border border-blue-500/20">
          <h3 className="text-sm font-bold text-blue-400 mb-2 border-b border-white/5 pb-1 flex justify-between">
            <span>Conteúdo da Cápsula</span>
            <span>Total: {loadout.totalValue.toFixed(0)} pts</span>
          </h3>
          <ul className="space-y-2">
            {loadout.selectedItems.map((entry, idx) => (
              <li key={idx} className="text-xs text-gray-300 flex justify-between items-center bg-white/5 p-1.5 rounded">
                <span className="flex items-center gap-1">
                  <ArrowRight size={12} className="text-sci-accent" />
                  {entry.item.name} {(entry.fraction < 1) && <span className="text-yellow-500">({(entry.fraction * 100).toFixed(0)}%)</span>}
                </span>
                <span className="flex gap-2">
                  <span className="text-gray-500 flex items-center gap-1"><Scale size={10}/> {(entry.item.weight * entry.fraction).toFixed(1)}kg</span>
                  <span className="text-blue-300">{(entry.item.combatValue * entry.fraction).toFixed(0)} pts</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
