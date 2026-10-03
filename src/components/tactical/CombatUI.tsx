import React, { useState } from 'react';
import { maximizeAttacks, AttackAction } from '../../algorithms/syncAttack';
import { Crosshair, Zap, Play } from 'lucide-react';

const SHIELD_WINDOW = { start: 5, end: 20 };

const availableAttacks: AttackAction[] = [
  { id: 'atk1', name: 'Tiro Rápido', start: 6, end: 9 },
  { id: 'atk2', name: 'Granada de Plasma', start: 8, end: 12 },
  { id: 'atk3', name: 'Raio Laser', start: 11, end: 16 },
  { id: 'atk4', name: 'Recarga Tática', start: 10, end: 13 },
  { id: 'atk5', name: 'Míssil Pesado', start: 14, end: 19 },
];

export const CombatUI: React.FC = () => {
  const [scheduledAttacks, setScheduledAttacks] = useState<AttackAction[]>([]);
  const [hasExecuted, setHasExecuted] = useState(false);

  const handleExecute = () => {
    const optimized = maximizeAttacks(availableAttacks);
    setScheduledAttacks(optimized);
    setHasExecuted(true);
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title alert">
          <Crosshair size={20} /> Ataque Sincronizado
        </h2>
        <div className="badge sci-text-alert" style={{ borderColor: 'rgba(255, 42, 42, 0.3)', border: '1px solid' }}>
          Escudo Inimigo Off: T{SHIELD_WINDOW.start} a T{SHIELD_WINDOW.end}
        </div>
      </div>

      <p className="sci-desc">
        O algoritmo Interval Scheduling selecionará a combinação que encaixa o máximo de ataques sem sobreposição (Earliest Finish Time First).
      </p>

      <div className="grid-layout-2">
        <div>
          <h3 className="sci-text-sm sci-text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Ações Disponíveis (Conflitantes)
          </h3>
          <div className="flex-col gap-2">
            {availableAttacks.map(atk => (
              <div key={atk.id} className="sci-card" style={{ padding: '0.75rem' }}>
                <span className="sci-text-sm" style={{ color: '#e5e7eb', fontWeight: 500 }}>{atk.name}</span>
                <span className="badge sci-text-muted" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  T{atk.start} ➝ T{atk.end}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="sci-text-sm sci-text-accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Plano de Execução Otimizado
          </h3>
          
          <div style={{ minHeight: '220px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.2)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!hasExecuted ? (
              <div className="sci-text-sm sci-text-muted" style={{ textAlign: 'center', opacity: 0.7 }}>
                Aguardando autorização de sincronismo...
              </div>
            ) : (
              <div className="flex-col gap-3">
                {scheduledAttacks.map((atk, idx) => (
                  <div key={atk.id} className="flex-between" style={{ backgroundColor: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.4)', padding: '0.75rem', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,240,255,0.1)' }}>
                    <span className="sci-text-sm sci-text-accent flex align-center gap-2" style={{ fontWeight: 'bold' }}>
                      <Zap size={16} color="#fff" /> {idx + 1}. {atk.name}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'rgba(0,240,255,0.2)', color: '#fff' }}>
                      T{atk.start} ➝ T{atk.end}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleExecute}
            className="sci-btn alert primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Play size={18} /> Executar Sincronismo
          </button>
        </div>
      </div>
    </div>
  );
};
