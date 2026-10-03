import React, { useState } from 'react';
import { useGameStore, Mercenary } from '../../store/useGameStore';
import { calculateSafeStops } from '../../algorithms/tacticalAdvance';
import { Map, Footprints, ShieldAlert } from 'lucide-react';

const SAFE_POSTS = [0, 5, 12, 18, 25, 30, 40, 50]; // Distâncias
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
    <div className="bg-sci-panel border border-sci-border p-4 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sci-accent flex items-center gap-2">
          <Map size={20} /> Avanço sob Fogo (Trincheiras)
        </h2>
        {selectedMerc && (
          <div className="text-sm font-bold text-gray-400 bg-black/40 px-3 py-1.5 rounded flex items-center gap-2 border border-white/5">
            <Footprints size={14} className="text-sci-accent" /> AP Máximo: {selectedMerc.ap}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        {mercenaries.length === 0 && (
          <div className="text-gray-500 text-sm italic">Nenhum mercenário recrutado. Volte à Nave-Mãe.</div>
        )}
        {mercenaries.map((merc) => (
          <button
            key={merc.id}
            onClick={() => { setSelectedMerc(merc); setCalculatedStops([]); setError(''); }}
            className={`px-4 py-2 text-sm font-bold rounded transition-colors ${
              selectedMerc?.id === merc.id 
                ? 'bg-sci-accent text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                : 'bg-black/50 text-gray-400 border border-white/10 hover:border-sci-accent/50'
            }`}
          >
            {merc.name} (AP: {merc.ap})
          </button>
        ))}
      </div>

      <div className="relative h-32 bg-black/50 rounded-lg flex items-center px-8 border border-white/5 overflow-hidden">
        {/* Track Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-800 -translate-y-1/2 rounded" />
        
        {/* Posts */}
        {SAFE_POSTS.map((postDistance) => {
          const isStop = calculatedStops.includes(postDistance);
          const isStart = postDistance === 0;
          const isTarget = postDistance === TARGET_DISTANCE;
          const posPercent = (postDistance / TARGET_DISTANCE) * 100;
          
          return (
            <div 
              key={postDistance} 
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `calc(2rem + calc(100% - 4rem) * ${posPercent / 100})` }}
            >
              <div className={`w-5 h-5 rounded-full border-4 z-10 transition-colors duration-300 ${
                isStop ? 'bg-sci-accent border-white shadow-[0_0_15px_#00f0ff] scale-125' 
                : isStart ? 'bg-gray-400 border-gray-600'
                : isTarget ? 'bg-sci-alert border-red-900 shadow-[0_0_15px_#ff2a2a]'
                : 'bg-gray-900 border-gray-700'
              }`} />
              <div className={`text-[11px] mt-3 font-black ${isStop ? 'text-sci-accent' : isTarget ? 'text-sci-alert' : 'text-gray-600'}`}>
                {postDistance}m
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleAdvance}
          disabled={!selectedMerc}
          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-6 py-3 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calcular Rota Segura (Guloso)
        </button>
        
        {error && (
          <div className="text-sci-alert text-sm font-bold flex items-center gap-2 bg-red-900/20 border border-red-500/30 px-4 py-2 rounded">
            <ShieldAlert size={16} /> {error}
          </div>
        )}
        
        {calculatedStops.length > 0 && (
          <div className="text-sci-success text-sm font-bold bg-sci-success/10 border border-sci-success/30 px-4 py-2 rounded">
            Rota viável! {calculatedStops.length - 1} paradas exigidas.
          </div>
        )}
      </div>
    </div>
  );
};
