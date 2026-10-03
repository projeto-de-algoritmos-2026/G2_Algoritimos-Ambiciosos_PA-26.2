import React, { useState } from 'react';
import { useGameStore, Mercenary } from '../../store/useGameStore';
import { greedyCoinChange, optimalCoinChange, AVAILABLE_COINS } from '../../algorithms/blackMarket';
import { ShoppingCart, Coins, Cpu, ShieldAlert } from 'lucide-react';

const mercenariesToBuy: (Mercenary & { cost: number })[] = [
  { id: 'merc1', name: 'Juggernaut', role: 'Tank', ap: 8, cost: 24 },
  { id: 'merc2', name: 'Ghost', role: 'Sniper', ap: 12, cost: 35 }
];

export const BlackMarket: React.FC = () => {
  const { credits, removeCredits, recruitMercenary } = useGameStore();
  const [message, setMessage] = useState('');

  const handleAutoBuy = (merc: typeof mercenariesToBuy[0]) => {
    // A inteligência gulosa tenta comprar
    const result = greedyCoinChange(merc.cost);
    const optimalResult = optimalCoinChange(merc.cost);
    
    // Calcula o valor total gasto pelo guloso (que pode ser maior ou igual ao custo real se o algoritmo errasse, mas aqui usamos as moedas pra calcular o 'desperdício' físico)
    // Na verdade, o algoritmo da mecânica é pra dar o "Troco" ou "Gastar moedas".
    // Vamos simular que o jogador usa moedas do inventário e o auto-buy gasta mais moedas.
    
    const wasOptimal = result.totalCoins === optimalResult.totalCoins;
    
    if (credits >= merc.cost) {
      removeCredits(merc.cost);
      recruitMercenary(merc);
      
      if (wasOptimal) {
        setMessage(`Auto-buy eficiente. Usou ${result.totalCoins} moedas: [${result.coinsUsed.join(', ')}]`);
      } else {
        setMessage(`Auto-buy guloso! Desperdiçou espaço gastando ${result.totalCoins} moedas [${result.coinsUsed.join(', ')}]. O ótimo seria ${optimalResult.totalCoins} moedas.`);
      }
    } else {
      setMessage('Créditos insuficientes!');
    }
  };

  return (
    <div className="bg-sci-panel border border-sci-border p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sci-accent flex items-center gap-2">
          <ShoppingCart size={20} /> Mercado Negro
        </h2>
        <div className="flex items-center gap-2 text-yellow-500 font-bold">
          <Coins size={18} /> {credits} C
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Contrate mercenários. Cuidado: a IA de auto-compra usa um sistema guloso não-canônico ({AVAILABLE_COINS.join(', ')}).
      </p>

      {message && (
        <div className="mb-4 p-2 bg-black/50 border border-yellow-500/30 text-yellow-400 text-xs rounded flex gap-2 items-start">
          <ShieldAlert size={14} className="shrink-0 mt-0.5" />
          <p>{message}</p>
        </div>
      )}

      <div className="space-y-3">
        {mercenariesToBuy.map((merc) => (
          <div key={merc.id} className="bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-purple-400 flex items-center gap-2">
                <Cpu size={14} /> {merc.name}
              </h3>
              <div className="text-xs text-gray-400 mt-1">
                Classe: {merc.role} | AP: {merc.ap}
              </div>
            </div>
            <button
              onClick={() => handleAutoBuy(merc)}
              className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded transition-colors text-sm font-semibold flex items-center gap-1"
            >
              Comprar ({merc.cost} C)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
