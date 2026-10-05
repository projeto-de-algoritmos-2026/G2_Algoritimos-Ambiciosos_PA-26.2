import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { optimizeDropPod } from '../../algorithms/dropPod';
import type { PodItem } from '../../algorithms/dropPod';
import { Package, Zap, Scale, ArrowRight, Plus, Minus, BarChart3 } from 'lucide-react';

const availableItems: PodItem[] = [
  { id: 'item1', name: 'Munição AP', weight: 10, combatValue: 60 },
  { id: 'item2', name: 'Rações Extras', weight: 20, combatValue: 100 },
  { id: 'item3', name: 'Kit Médico', weight: 30, combatValue: 120 },
  { id: 'item4', name: 'Granadas de Plasma', weight: 8, combatValue: 55 },
  { id: 'item5', name: 'Colete Reforçado', weight: 15, combatValue: 70 },
  { id: 'item6', name: 'Minas Terrestres', weight: 12, combatValue: 65 },
  { id: 'item7', name: 'Drone de Reconhec.', weight: 5, combatValue: 35 },
  { id: 'item8', name: 'Escudo Portátil', weight: 25, combatValue: 90 },
  { id: 'item9', name: 'Rifle de Precisão', weight: 18, combatValue: 85 },
  { id: 'item10', name: 'Bateria de Energia', weight: 7, combatValue: 40 },
];

interface PodSelection {
  item: PodItem;
  fraction: number;
}

const MAX_WEIGHT = 50;

export const DropPod: React.FC = () => {
  const { inventory, setInventory, clearInventory, tutorialStep, nextTutorialStep } = useGameStore();
  const [selections, setSelections] = useState<PodSelection[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [committed, setCommitted] = useState(false);

  const currentWeight = selections.reduce((sum, s) => sum + s.item.weight * s.fraction, 0);
  const currentValue = selections.reduce((sum, s) => sum + s.item.combatValue * s.fraction, 0);
  const remainingWeight = MAX_WEIGHT - currentWeight;
  const selectedIds = new Set(selections.map(s => s.item.id));

  const greedyResult = useMemo(() => optimizeDropPod(availableItems, MAX_WEIGHT), []);

  const isAlreadyLoaded = inventory.length > 0 && !committed && selections.length === 0;

  const addItem = (item: PodItem) => {
    if (selectedIds.has(item.id)) return;
    if (remainingWeight < item.weight * 0.10) return;

    if (item.weight <= remainingWeight) {
      setSelections(prev => [...prev, { item, fraction: 1 }]);
    } else {
      const maxFraction = remainingWeight / item.weight;
      const roundedFraction = Math.floor(maxFraction * 10) / 10;
      if (roundedFraction >= 0.1) {
        setSelections(prev => [...prev, { item, fraction: roundedFraction }]);
      }
    }
  };

  const removeItem = (id: string) => {
    setSelections(prev => prev.filter(s => s.item.id !== id));
  };

  const updateFraction = (id: string, newFraction: number) => {
    setSelections(prev => {
      const otherWeight = prev.filter(s => s.item.id !== id).reduce((sum, s) => sum + s.item.weight * s.fraction, 0);
      const item = prev.find(s => s.item.id === id)!;
      const maxFraction = Math.min(1, (MAX_WEIGHT - otherWeight) / item.item.weight);
      const clampedFraction = Math.min(newFraction, maxFraction);
      return prev.map(s => s.item.id === id ? { ...s, fraction: Math.floor(clampedFraction * 10) / 10 } : s);
    });
  };

  const commitLoadout = () => {
    const items = selections.map(s => ({
      id: s.item.id,
      name: s.fraction < 1 ? `${s.item.name} (${(s.fraction * 100).toFixed(0)}%)` : s.item.name,
      weight: s.item.weight * s.fraction,
      combatValue: s.item.combatValue * s.fraction,
    }));
    setInventory(items);
    setCommitted(true);
    if (tutorialStep === 2) nextTutorialStep();
  };

  const handleReconfigure = () => {
    clearInventory();
    setSelections([]);
    setCommitted(false);
    setShowComparison(false);
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title">
          <Package size={20} /> Drop Pod Loadout
        </h2>
        <div className="badge">Max: {MAX_WEIGHT}kg</div>
      </div>

      <p className="sci-desc">
        Escolha os suprimentos manualmente. Ajuste frações com o slider se um item não couber inteiro.
        Depois compare com o algoritmo de <strong>Mochila Fracionária</strong>.
      </p>

      {/* Pod já carregado */}
      {isAlreadyLoaded && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="msg-box success" style={{ marginBottom: '0.75rem' }}>
            <Zap size={16} />
            <span>Pod já carregado com {inventory.length} ite{inventory.length > 1 ? 'ns' : 'm'}.</span>
          </div>
          <button onClick={handleReconfigure} className="sci-btn" style={{ width: '100%' }}>
            Reconfigurar Pod
          </button>
        </div>
      )}

      {!isAlreadyLoaded && (
        <>
          {/* Capacity Bar */}
          <div className="capacity-bar-container">
            <div className="capacity-bar-track">
              <div
                className="capacity-bar-fill"
                style={{
                  width: `${(currentWeight / MAX_WEIGHT) * 100}%`,
                  backgroundColor: currentWeight > MAX_WEIGHT ? 'var(--color-alert)' : 'var(--color-accent)'
                }}
              />
            </div>
            <div className="flex-between sci-text-xs" style={{ marginTop: '0.25rem' }}>
              <span className="sci-text-muted">{currentWeight.toFixed(1)}kg / {MAX_WEIGHT}kg</span>
              <span className="sci-text-accent">{currentValue.toFixed(0)} pts</span>
            </div>
          </div>

          {/* Available Items */}
          <div className="flex-col gap-2" style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
            {availableItems.map(item => {
              const inPod = selectedIds.has(item.id);
              const canAdd = !inPod && !committed && item.weight * 0.10 <= remainingWeight + 0.01;
              const ratio = (item.combatValue / item.weight).toFixed(1);

              return (
                <div key={item.id} className="sci-card" style={inPod ? { opacity: 0.4, borderColor: 'var(--color-accent)' } : !canAdd && !committed ? { opacity: 0.5 } : {}}>
                  <div style={{ flex: 1 }}>
                    <h3 className="sci-text-sm" style={{ margin: 0 }}>{item.name}</h3>
                    <div className="flex gap-3 sci-text-xs sci-text-muted mt-1">
                      <span><Scale size={10} /> {item.weight}kg</span>
                      <span style={{ color: '#93c5fd' }}>{item.combatValue}pts</span>
                      <span style={{ color: '#a78bfa' }}>ratio: {ratio}</span>
                    </div>
                  </div>
                  {!committed && (
                    <button
                      onClick={() => inPod ? removeItem(item.id) : addItem(item)}
                      disabled={!inPod && !canAdd}
                      className="sci-btn"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {inPod ? <><Minus size={12} /> Remover</> : <><Plus size={12} /> Adicionar</>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selections with Fraction Sliders */}
          {selections.length > 0 && (
            <div className="pod-contents">
              <h3 className="sci-text-sm sci-text-accent" style={{ textTransform: 'uppercase', margin: '0 0 0.75rem 0', letterSpacing: '0.05em' }}>
                Conteúdo do Pod
              </h3>
              <div className="flex-col gap-2">
                {selections.map(sel => (
                  <div key={sel.item.id} className="pod-item">
                    <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                      <span className="sci-text-sm flex align-center gap-2">
                        <ArrowRight size={12} className="sci-text-accent" />
                        {sel.item.name}
                        {sel.fraction < 1 && <span className="sci-text-yellow">({(sel.fraction * 100).toFixed(0)}%)</span>}
                      </span>
                      <span className="sci-text-xs" style={{ color: '#93c5fd' }}>
                        {(sel.item.combatValue * sel.fraction).toFixed(0)}pts / {(sel.item.weight * sel.fraction).toFixed(1)}kg
                      </span>
                    </div>
                    {!committed && (
                      <div className="fraction-slider-row">
                        <input
                          type="range"
                          min={10}
                          max={100}
                          step={10}
                          value={sel.fraction * 100}
                          onChange={(e) => updateFraction(sel.item.id, Number(e.target.value) / 100)}
                          className="fraction-slider"
                        />
                        <span className="sci-text-xs sci-text-muted" style={{ minWidth: '40px', textAlign: 'right' }}>
                          {(sel.fraction * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commit Button */}
          {!committed && selections.length > 0 && (
            <button onClick={commitLoadout} className="sci-btn primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Zap size={16} /> Confirmar Loadout ({currentValue.toFixed(0)} pts)
            </button>
          )}

          {/* Comparison */}
          {committed && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="sci-btn"
                style={{ width: '100%', color: '#a78bfa', borderColor: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
              >
                <BarChart3 size={16} /> {showComparison ? 'Ocultar' : 'Comparar com'} Mochila Fracionária
              </button>

              {showComparison && (
                <div className="comparison-grid" style={{ marginTop: '1rem' }}>
                  <div className={`comparison-card ${currentValue >= greedyResult.totalValue - 0.01 ? 'optimal' : ''}`}>
                    <h4>Sua Solução</h4>
                    <div className="comparison-coins">{currentValue.toFixed(0)} pts</div>
                    <div className="sci-text-xs sci-text-muted">{currentWeight.toFixed(1)}kg usados</div>
                  </div>
                  <div className="comparison-card optimal">
                    <h4>Mochila Fracionária</h4>
                    <div className="comparison-coins">{greedyResult.totalValue.toFixed(0)} pts</div>
                    <div className="sci-text-xs sci-text-muted">{greedyResult.totalWeight.toFixed(1)}kg usados</div>
                  </div>
                </div>
              )}

              {showComparison && currentValue < greedyResult.totalValue - 0.01 && (
                <div className="msg-box warning" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  <Zap size={16} />
                  <span>O algoritmo guloso ordena pela razão valor/peso. Você perdeu <strong>{(greedyResult.totalValue - currentValue).toFixed(0)} pts</strong> em relação ao ótimo!</span>
                </div>
              )}

              {showComparison && currentValue >= greedyResult.totalValue - 0.01 && (
                <div className="msg-box success" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  <Zap size={16} />
                  <span>Parabéns! Sua solução é tão boa quanto a da Mochila Fracionária!</span>
                </div>
              )}

              <button onClick={handleReconfigure} className="sci-btn" style={{ width: '100%', marginTop: '0.75rem', opacity: 0.7 }}>
                Reconfigurar Pod
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
