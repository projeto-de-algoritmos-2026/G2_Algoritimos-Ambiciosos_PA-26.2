import React, { useState } from 'react';
import { maximizeAttacks, AttackAction } from '../../algorithms/syncAttack';
import { Crosshair, Zap, Play } from 'lucide-react';

// Janela do escudo do boss: O escudo cai no turno 5 e volta no turno 20.
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
    <div className="bg-sci-panel border border-sci-border p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sci-alert flex items-center gap-2">
          <Crosshair size={20} /> Ataque Sincronizado
        </h2>
        <div className="text-sm font-bold bg-black/40 px-3 py-1.5 rounded border border-sci-alert/30 text-sci-alert">
          Escudo Inimigo Off: T{SHIELD_WINDOW.start} a T{SHIELD_WINDOW.end}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        O algoritmo Interval Scheduling selecionará a combinação que encaixa o máximo de ataques sem sobreposição (Earliest Finish Time First).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest border-b border-white/5 pb-2">
            Ações Disponíveis (Conflitantes)
          </h3>
          <div className="space-y-2">
            {availableAttacks.map(atk => (
              <div key={atk.id} className="bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
                <span className="text-sm text-gray-300 font-medium">{atk.name}</span>
                <span className="text-xs text-gray-400 font-mono bg-black/50 px-2 py-1 rounded border border-white/5">
                  T{atk.start} ➝ T{atk.end}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-sci-accent mb-3 uppercase tracking-widest border-b border-sci-accent/20 pb-2">
            Plano de Execução Otimizado
          </h3>
          
          <div className="min-h-[220px] bg-black/50 rounded-lg border border-sci-accent/20 p-4 flex flex-col justify-center shadow-inner">
            {!hasExecuted ? (
              <div className="text-center text-gray-600 text-sm animate-pulse">
                Aguardando autorização de sincronismo...
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledAttacks.map((atk, idx) => (
                  <div key={atk.id} className="bg-sci-accent/10 border border-sci-accent/40 p-3 rounded flex justify-between items-center shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                    <span className="text-sm text-sci-accent font-bold flex items-center gap-2">
                      <Zap size={16} className="text-white" /> {idx + 1}. {atk.name}
                    </span>
                    <span className="text-xs text-white font-mono bg-sci-accent/20 px-2 py-1 rounded">
                      T{atk.start} ➝ T{atk.end}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleExecute}
            className="w-full mt-4 bg-sci-alert/20 hover:bg-sci-alert/40 text-sci-alert border border-sci-alert/30 px-4 py-3 rounded font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(255,42,42,0.4)]"
          >
            <Play size={18} /> Executar Sincronismo
          </button>
        </div>
      </div>
    </div>
  );
};
