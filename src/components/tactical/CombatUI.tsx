import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { maximizeAttacks } from '../../algorithms/syncAttack';
import type { AttackAction } from '../../algorithms/syncAttack';
import { Crosshair, Zap, BarChart3, AlertTriangle, Check } from 'lucide-react';

const SHIELD_WINDOW = { start: 5, end: 20 };

const availableAttacks: AttackAction[] = [
  { id: 'atk1', name: 'Tiro Rápido', start: 6, end: 9 },
  { id: 'atk2', name: 'Granada de Plasma', start: 8, end: 12 },
  { id: 'atk3', name: 'Raio Laser', start: 11, end: 16 },
  { id: 'atk4', name: 'Recarga Tática', start: 10, end: 13 },
  { id: 'atk5', name: 'Míssil Pesado', start: 14, end: 19 },
  { id: 'atk6', name: 'Pulso EMP', start: 6, end: 8 },
  { id: 'atk7', name: 'Lança Chamas', start: 13, end: 17 },
];

export const CombatUI: React.FC = () => {
  const { tutorialStep, nextTutorialStep } = useGameStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const selectedAttacks = availableAttacks.filter(a => selectedIds.has(a.id));
  const optimalAttacks = useMemo(() => maximizeAttacks(availableAttacks), []);

  // Detect conflicts (overlapping attacks)
  const conflicts = useMemo(() => {
    const conflictPairs: [string, string][] = [];
    const selected = [...selectedAttacks].sort((a, b) => a.start - b.start);
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        if (selected[j].start < selected[i].end) {
          conflictPairs.push([selected[i].id, selected[j].id]);
        }
      }
    }
    return conflictPairs;
  }, [selectedIds]);

  const hasConflicts = conflicts.length > 0;
  const conflictIds = new Set(conflicts.flat());

  const toggleAttack = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (tutorialStep === 5) nextTutorialStep();
  };

  const timelineStart = SHIELD_WINDOW.start;
  const timelineEnd = SHIELD_WINDOW.end;
  const timeRange = timelineEnd - timelineStart;

  const getBarStyle = (atk: AttackAction) => {
    const left = ((atk.start - timelineStart) / timeRange) * 100;
    const width = ((atk.end - atk.start) / timeRange) * 100;
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - Math.max(0, left), width)}%` };
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title alert">
          <Crosshair size={20} /> Ataque Sincronizado
        </h2>
        <div className="badge sci-text-alert" style={{ borderColor: 'rgba(255, 42, 42, 0.3)', border: '1px solid' }}>
          Escudo Off: T{SHIELD_WINDOW.start} — T{SHIELD_WINDOW.end}
        </div>
      </div>

      <p className="sci-desc">
        Selecione ataques na <strong>timeline</strong> para executar na janela de vulnerabilidade. Evite sobreposições!
        Depois compare com o <strong>Interval Scheduling</strong>.
      </p>

      {/* Timeline */}
      <div className="attack-timeline">
        <div className="timeline-header">
          {Array.from({ length: timeRange + 1 }, (_, i) => (
            <span key={i} className="timeline-tick">T{timelineStart + i}</span>
          ))}
        </div>
        <div className="timeline-body">
          {availableAttacks.map(atk => {
            const isSelected = selectedIds.has(atk.id);
            const isConflict = conflictIds.has(atk.id) && isSelected;
            const barStyle = getBarStyle(atk);

            return (
              <div key={atk.id} className="timeline-row">
                <div className="timeline-label">{atk.name}</div>
                <div className="timeline-track">
                  <div
                    className={`timeline-bar ${isSelected ? 'selected' : ''} ${isConflict ? 'conflict' : ''}`}
                    style={barStyle}
                    onClick={() => toggleAttack(atk.id)}
                    title={`T${atk.start} → T${atk.end} — clique para ${isSelected ? 'remover' : 'selecionar'}`}
                  >
                    <span className="timeline-bar-label">T{atk.start}–T{atk.end}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="flex-between" style={{ marginTop: '1rem' }}>
        <span className="sci-text-sm">
          Selecionados: <strong className="sci-text-accent">{selectedAttacks.length}</strong>
        </span>
        {hasConflicts && (
          <div className="flex align-center gap-2 sci-text-alert sci-text-sm" style={{ fontWeight: 'bold' }}>
            <AlertTriangle size={16} /> {conflicts.length} conflito{conflicts.length > 1 ? 's' : ''}!
          </div>
        )}
        {!hasConflicts && selectedAttacks.length > 0 && (
          <div className="flex align-center gap-2 sci-text-success sci-text-sm" style={{ fontWeight: 'bold' }}>
            <Check size={16} /> Sem conflitos!
          </div>
        )}
      </div>

      {hasConflicts && (
        <div className="msg-box alert" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={16} />
          <span>Ataques sobrepostos! Remova ataques conflitantes para uma execução válida.</span>
        </div>
      )}

      {/* Comparison */}
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="sci-btn"
        style={{ width: '100%', marginTop: '1rem', color: '#a78bfa', borderColor: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
      >
        <BarChart3 size={16} /> {showComparison ? 'Ocultar' : 'Comparar com'} Interval Scheduling
      </button>

      {showComparison && (
        <div className="comparison-grid" style={{ marginTop: '1rem' }}>
          <div className={`comparison-card ${!hasConflicts && selectedAttacks.length >= optimalAttacks.length ? 'optimal' : ''}`}>
            <h4>Sua Seleção</h4>
            <div className="comparison-coins">{selectedAttacks.length} ataques</div>
            <div className="sci-text-xs sci-text-muted">
              {hasConflicts ? `⚠ ${conflicts.length} conflito(s)` : '✓ Sem conflitos'}
            </div>
          </div>
          <div className="comparison-card optimal">
            <h4>Interval Scheduling</h4>
            <div className="comparison-coins">{optimalAttacks.length} ataques</div>
            <div className="sci-text-xs sci-text-muted">
              {optimalAttacks.map(a => a.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      {showComparison && !hasConflicts && selectedAttacks.length >= optimalAttacks.length && (
        <div className="msg-box success" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <Zap size={16} />
          <span>Excelente! Sua seleção encaixa tantos ataques quanto o Interval Scheduling!</span>
        </div>
      )}

      {showComparison && (!hasConflicts && selectedAttacks.length < optimalAttacks.length) && (
        <div className="msg-box warning" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <Zap size={16} />
          <span>O algoritmo (Earliest Finish Time) encaixa {optimalAttacks.length - selectedAttacks.length} ataque(s) a mais sem sobreposição!</span>
        </div>
      )}

      {showComparison && hasConflicts && (
        <div className="msg-box warning" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <AlertTriangle size={16} />
          <span>Resolva os conflitos primeiro para uma comparação justa com o algoritmo!</span>
        </div>
      )}
    </div>
  );
};
