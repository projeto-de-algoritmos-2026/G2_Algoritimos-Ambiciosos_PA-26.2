import React, { useState } from 'react';
import { useGameStore, Mercenary } from '../../store/useGameStore';
import { calculateSafeStops } from '../../algorithms/tacticalAdvance';
import { Map, Footprints, ShieldAlert } from 'lucide-react';

const SAFE_POSTS = [0, 5, 12, 18, 25, 30, 40, 50];
const TARGET_DISTANCE = 50;

export const GridMap: React.FC = () => {
  const { mercenaries } = useGameStore();
  const [selectedMerc, setSelectedMerc] = useState<Mercenary | null>(mercenaries[0] || null);
  const [calculatedStops, setCalculatedStops] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleAdvance = () => {
    if (!selectedMerc) return;
    setError('');
    try {
      const stops = calculateSafeStops(SAFE_POSTS, selectedMerc.ap, TARGET_DISTANCE);
      setCalculatedStops(stops);
    } catch (err: any) {
      setCalculatedStops([]);
      setError(err.message || 'AP Insuficiente');
    }
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title">
          <Map size={20} /> Avanço sob Fogo (Trincheiras)
        </h2>
        {selectedMerc && (
          <div className="badge flex align-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <Footprints size={14} className="sci-text-accent" /> AP Máximo: {selectedMerc.ap}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        {mercenaries.length === 0 && (
          <div className="sci-text-muted sci-text-sm" style={{ fontStyle: 'italic' }}>Nenhum mercenário recrutado. Volte à Nave-Mãe.</div>
        )}
        {mercenaries.map((merc) => (
          <button
            key={merc.id}
            onClick={() => { setSelectedMerc(merc); setCalculatedStops([]); setError(''); }}
            className="sci-btn"
            style={
              selectedMerc?.id === merc.id 
                ? { backgroundColor: 'var(--color-accent)', color: '#000', borderColor: 'var(--color-accent)' }
                : { backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--color-text-muted)', borderColor: 'rgba(255,255,255,0.1)' }
            }
          >
            {merc.name} (AP: {merc.ap})
          </button>
        ))}
      </div>

      <div className="track-container">
        <div className="track-line" />
        
        {SAFE_POSTS.map((postDistance) => {
          const isStop = calculatedStops.includes(postDistance);
          const isStart = postDistance === 0;
          const isTarget = postDistance === TARGET_DISTANCE;
          const posPercent = (postDistance / TARGET_DISTANCE) * 100;
          
          return (
            <div 
              key={postDistance} 
              className="track-post"
              style={{ left: `calc(2rem + calc(100% - 4rem) * ${posPercent / 100})` }}
            >
              <div className={`track-node ${isStop ? 'stop' : isStart ? 'start' : isTarget ? 'target' : ''}`} />
              <div className={`track-label ${isStop ? 'stop' : isTarget ? 'target' : ''}`}>
                {postDistance}m
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-between mt-4">
        <button
          onClick={handleAdvance}
          disabled={!selectedMerc}
          className="sci-btn primary"
          style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}
        >
          Calcular Rota Segura (Guloso)
        </button>
        
        {error && (
          <div className="msg-box alert" style={{ margin: 0 }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}
        
        {calculatedStops.length > 0 && (
          <div className="msg-box success" style={{ margin: 0 }}>
            Rota viável! {calculatedStops.length - 1} paradas exigidas.
          </div>
        )}
      </div>
    </div>
  );
};
