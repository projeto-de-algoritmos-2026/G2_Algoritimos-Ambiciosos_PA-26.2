import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { Mercenary } from '../../store/useGameStore';
import { greedyCoinChange, optimalCoinChange, AVAILABLE_COINS } from '../../algorithms/blackMarket';
import { ShoppingCart, Coins, Cpu, ShieldAlert } from 'lucide-react';

const mercenariesToBuy: (Mercenary & { cost: number })[] = [
  { id: 'merc1', name: 'Juggernaut', role: 'Tank', ap: 8, cost: 24 },
  { id: 'merc2', name: 'Ghost', role: 'Sniper', ap: 12, cost: 35 }
];

export const BlackMarket: React.FC = () => {
  const { credits, removeCredits, recruitMercenary, tutorialStep, nextTutorialStep } = useGameStore();
  const [message, setMessage] = useState('');

  const handleAutoBuy = (merc: typeof mercenariesToBuy[0]) => {
    const result = greedyCoinChange(merc.cost);
    const optimalResult = optimalCoinChange(merc.cost);
    const wasOptimal = result.totalCoins === optimalResult.totalCoins;
    
    if (credits >= merc.cost) {
      removeCredits(merc.cost);
      recruitMercenary(merc);
      
      if (wasOptimal) {
        setMessage(`Auto-buy eficiente. Usou ${result.totalCoins} moedas: [${result.coinsUsed.join(', ')}]`);
      } else {
        setMessage(`Auto-buy guloso! Gastou ${result.totalCoins} moedas [${result.coinsUsed.join(', ')}]. O ótimo seria ${optimalResult.totalCoins} moedas.`);
      }
      if (tutorialStep === 0) nextTutorialStep();
    } else {
      setMessage('Créditos insuficientes!');
    }
  };

  return (
    <div className="sci-panel">
      <div className="flex-between mb-4">
        <h2 className="sci-title">
          <ShoppingCart size={20} /> Mercado Negro
        </h2>
        <div className="flex align-center gap-2 sci-text-yellow" style={{ fontWeight: 'bold' }}>
          <Coins size={18} /> {credits} C
        </div>
      </div>

      <p className="sci-desc">
        Contrate mercenários. Cuidado: a IA de auto-compra usa um sistema guloso não-canônico ({AVAILABLE_COINS.join(', ')}).
      </p>

      {message && (
        <div className={`msg-box ${message.includes('insuficientes') ? 'alert' : message.includes('guloso') ? 'warning' : 'success'}`}>
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      <div className="flex-col gap-3">
        {mercenariesToBuy.map((merc) => (
          <div key={merc.id} className="sci-card">
            <div>
              <h3 className="flex align-center gap-2" style={{ color: '#c084fc' }}>
                <Cpu size={14} /> {merc.name}
              </h3>
              <div className="sci-text-xs sci-text-muted mt-1">
                Classe: {merc.role} | AP: {merc.ap}
              </div>
            </div>
            <button
              onClick={() => handleAutoBuy(merc)}
              className="sci-btn"
              style={{ color: '#c084fc', borderColor: '#c084fc', backgroundColor: 'rgba(192, 132, 252, 0.1)' }}
            >
              Comprar ({merc.cost} C)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
