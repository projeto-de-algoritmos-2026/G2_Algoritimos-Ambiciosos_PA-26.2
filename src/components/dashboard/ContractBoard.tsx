import React, { useEffect, useState } from 'react';
import { useGameStore, Mission } from '../../store/useGameStore';
import { recommendMissions } from '../../algorithms/contractBoard';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    <div className="sci-panel">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2 className="sci-title">
          <AlertCircle size={20} /> Quadro de Contratos
        </h2>
        <button onClick={handleRunAlgorithm} className="sci-btn">
          Aplicar IA (EDF)
        </button>
      </div>
      
      <p className="sci-desc">
        Minimize penalidades atendendo contratos com o prazo mais próximo primeiro.
      </p>

      <div className="flex-col gap-2">
        {(sortedMissions.length > 0 ? sortedMissions : availableMissions).map((mission, index) => (
          <div key={mission.id} className="sci-card">
            <div>
              <h3>{mission.title}</h3>
              <div className="flex gap-3 sci-text-xs sci-text-muted mt-1">
                <span className="flex align-center gap-2"><Clock size={12} /> Duração: {mission.duration}</span>
                <span className="flex align-center gap-2 sci-text-alert"><AlertCircle size={12} /> Prazo: {mission.deadline}</span>
              </div>
            </div>
            {sortedMissions.length > 0 && (
              <div className="flex align-center gap-2 sci-text-success sci-text-xs" style={{ fontWeight: 'bold' }}>
                <CheckCircle2 size={14} /> Prioridade {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
