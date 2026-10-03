import React, { useEffect, useState } from 'react';
import { useGameStore, Mission } from '../../store/useGameStore';
import { recommendMissions } from '../../algorithms/contractBoard';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// Missões iniciais
const initialMissions: Mission[] = [
  { id: 'm1', title: 'Resgate de Cientista', duration: 3, deadline: 5 },
  { id: 'm2', title: 'Recuperar IA', duration: 2, deadline: 3 },
  { id: 'm3', title: 'Sabotagem de Escudo', duration: 4, deadline: 8 },
  { id: 'm4', title: 'Extração de Artefato', duration: 1, deadline: 2 },
];

export const ContractBoard: React.FC = () => {
  const { availableMissions, setAvailableMissions } = useGameStore();
  const [sortedMissions, setSortedMissions] = useState<Mission[]>([]);

  useEffect(() => {
    if (availableMissions.length === 0) {
      setAvailableMissions(initialMissions);
    }
  }, []);

  const handleRunAlgorithm = () => {
    const recommended = recommendMissions(availableMissions);
    setSortedMissions(recommended);
  };

  return (
    <div className="bg-sci-panel border border-sci-border p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sci-accent flex items-center gap-2">
          <AlertCircle size={20} /> Quadro de Contratos
        </h2>
        <button 
          onClick={handleRunAlgorithm}
          className="bg-sci-accent/20 hover:bg-sci-accent/40 text-sci-accent px-4 py-2 rounded transition-colors text-sm font-semibold"
        >
          Aplicar IA (EDF)
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        Minimize penalidades atendendo contratos com o prazo mais próximo primeiro.
      </p>

      <div className="space-y-2">
        {(sortedMissions.length > 0 ? sortedMissions : availableMissions).map((mission, index) => (
          <div key={mission.id} className="bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{mission.title}</h3>
              <div className="text-xs text-gray-400 flex gap-3 mt-1">
                <span className="flex items-center gap-1"><Clock size={12} /> Duração: {mission.duration} dias</span>
                <span className="flex items-center gap-1 text-sci-alert"><AlertCircle size={12} /> Prazo: {mission.deadline} dias</span>
              </div>
            </div>
            {sortedMissions.length > 0 && (
              <div className="text-sci-success text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Prioridade {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
