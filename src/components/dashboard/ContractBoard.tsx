import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { Mission } from '../../store/useGameStore';
import { recommendMissions, calculateLateness } from '../../algorithms/contractBoard';
import { Clock, AlertCircle, CheckCircle2, GripVertical, BarChart3, ArrowUpDown } from 'lucide-react';

const initialMissions: Mission[] = [
  { id: 'm1', title: 'Resgate de Cientista', duration: 3, deadline: 5 },
  { id: 'm2', title: 'Recuperar IA', duration: 2, deadline: 3 },
  { id: 'm3', title: 'Sabotagem de Escudo', duration: 4, deadline: 8 },
  { id: 'm4', title: 'Extração de Artefato', duration: 1, deadline: 2 },
  { id: 'm5', title: 'Hackear Terminal', duration: 2, deadline: 6 },
  { id: 'm6', title: 'Escoltar Prisioneiro', duration: 3, deadline: 7 },
];

export const ContractBoard: React.FC = () => {
  const { setAvailableMissions, tutorialStep, nextTutorialStep } = useGameStore();
  const [orderedMissions, setOrderedMissions] = useState<Mission[]>(initialMissions);
  const [showComparison, setShowComparison] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setAvailableMissions(initialMissions);
  }, []);

  const playerLateness = calculateLateness(orderedMissions);
  const edfOrder = recommendMissions(orderedMissions);
  const edfLateness = calculateLateness(edfOrder);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...orderedMissions];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, removed);
    setOrderedMissions(newOrder);
    setAvailableMissions(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);

    if (tutorialStep === 1) nextTutorialStep();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="sci-panel">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2 className="sci-title">
          <AlertCircle size={20} /> Quadro de Contratos
        </h2>
        <span className={`badge ${playerLateness.maxLateness > 0 ? 'sci-text-alert' : 'sci-text-success'}`}
              style={{ border: `1px solid ${playerLateness.maxLateness > 0 ? 'rgba(255,42,42,0.3)' : 'rgba(0,255,136,0.3)'}` }}>
          Atraso Max: {playerLateness.maxLateness}
        </span>
      </div>

      <p className="sci-desc">
        Arraste os contratos para reordená-los. Minimize o <strong>atraso máximo</strong>. Depois compare com o EDF.
      </p>

      <div className="flex-col gap-2">
        {orderedMissions.map((mission, index) => {
          const detail = playerLateness.details[index];
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <div
              key={mission.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`contract-card ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
            >
              <div className="flex align-center gap-3" style={{ flex: 1 }}>
                <div className="drag-handle">
                  <GripVertical size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{mission.title}</h3>
                  <div className="flex gap-3 sci-text-xs sci-text-muted mt-1">
                    <span className="flex align-center gap-2"><Clock size={12} /> Duração: {mission.duration}</span>
                    <span className="flex align-center gap-2 sci-text-alert"><AlertCircle size={12} /> Prazo: {mission.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="contract-lateness">
                <div className="sci-text-xs sci-text-muted">Término: T{detail.finishTime}</div>
                <div className={`sci-text-xs ${detail.lateness > 0 ? 'sci-text-alert' : 'sci-text-success'}`} style={{ fontWeight: 'bold' }}>
                  {detail.lateness > 0 ? `Atraso: +${detail.lateness}` : '✓ No prazo'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowComparison(!showComparison)}
        className="sci-btn"
        style={{ width: '100%', marginTop: '1rem', color: '#a78bfa', borderColor: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
      >
        <BarChart3 size={16} /> {showComparison ? 'Ocultar' : 'Comparar com'} EDF (Earliest Deadline First)
      </button>

      {showComparison && (
        <div className="comparison-grid" style={{ marginTop: '1rem' }}>
          <div className={`comparison-card ${playerLateness.maxLateness <= edfLateness.maxLateness ? 'optimal' : ''}`}>
            <h4>Sua Ordenação</h4>
            <div className="comparison-coins">Atraso Max: {playerLateness.maxLateness}</div>
            <div className="sci-text-xs sci-text-muted">Total: {playerLateness.totalLateness}</div>
          </div>
          <div className="comparison-card optimal">
            <h4>EDF (Guloso)</h4>
            <div className="comparison-coins">Atraso Max: {edfLateness.maxLateness}</div>
            <div className="sci-text-xs sci-text-muted">Total: {edfLateness.totalLateness}</div>
            <div className="sci-text-xs sci-text-muted" style={{ marginTop: '0.25rem' }}>
              Ordem: {edfOrder.map(m => m.title.split(' ').slice(0, 2).join(' ')).join(' → ')}
            </div>
          </div>
        </div>
      )}

      {showComparison && playerLateness.maxLateness > edfLateness.maxLateness && (
        <div className="msg-box warning" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <ArrowUpDown size={16} />
          <span>O EDF minimiza o atraso máximo ordenando pelo prazo mais próximo. Sua ordenação tem atraso {playerLateness.maxLateness - edfLateness.maxLateness} a mais!</span>
        </div>
      )}

      {showComparison && playerLateness.maxLateness <= edfLateness.maxLateness && (
        <div className="msg-box success" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <CheckCircle2 size={16} />
          <span>Parabéns! Sua ordenação é tão boa quanto a do EDF!</span>
        </div>
      )}
    </div>
  );
};
