import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { Mercenary } from '../../store/useGameStore';
import { greedyCoinChange, optimalCoinChange, AVAILABLE_COINS } from '../../algorithms/blackMarket';
import { ShoppingCart, Coins, Cpu, ShieldAlert, Plus, CreditCard, X, Check, ArrowLeft } from 'lucide-react';

type MercWithCost = Mercenary & { cost: number };

const mercenaryRoster: MercWithCost[] = [
  { id: 'merc1', name: 'Juggernaut', role: 'Tank', ap: 8, cost: 24 },
  { id: 'merc2', name: 'Ghost', role: 'Sniper', ap: 12, cost: 35 },
  { id: 'merc3', name: 'Patch', role: 'Medic', ap: 6, cost: 28 },
  { id: 'merc4', name: 'Wrench', role: 'Engineer', ap: 10, cost: 18 },
  { id: 'merc5', name: 'Fury', role: 'Berserker', ap: 14, cost: 42 },
  { id: 'merc6', name: 'Phantom', role: 'Scout', ap: 16, cost: 31 },
  { id: 'merc7', name: 'Titan', role: 'Heavy', ap: 5, cost: 50 },
  { id: 'merc8', name: 'Viper', role: 'Assassin', ap: 11, cost: 38 },
];

export const BlackMarket: React.FC = () => {
  const { credits, removeCredits, recruitMercenary, mercenaries, tutorialStep, nextTutorialStep } = useGameStore();
  const [cart, setCart] = useState<MercWithCost[]>([]);
  const [view, setView] = useState<'catalog' | 'payment' | 'result'>('catalog');
  const [manualCoins, setManualCoins] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<{
    total: number;
    manualCoins: number[];
    greedyResult: ReturnType<typeof greedyCoinChange>;
    optimalResult: ReturnType<typeof optimalCoinChange>;
  } | null>(null);

  const cartTotal = cart.reduce((sum, m) => sum + m.cost, 0);
  const manualTotal = manualCoins.reduce((sum, c) => sum + c, 0);
  const alreadyRecruited = new Set(mercenaries.map(m => m.id));
  const inCart = new Set(cart.map(m => m.id));

  const addToCart = (merc: MercWithCost) => {
    setCart(prev => [...prev, merc]);
    if (tutorialStep === 0) nextTutorialStep();
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(m => m.id !== id));
  };

  const startPayment = () => {
    if (cartTotal > credits) return;
    setManualCoins([]);
    setView('payment');
  };

  const addCoin = (coin: number) => {
    if (manualTotal >= cartTotal) return;
    setManualCoins(prev => [...prev, coin]);
  };

  const removeCoin = (index: number) => {
    setManualCoins(prev => prev.filter((_, i) => i !== index));
  };

  const confirmPayment = () => {
    if (manualTotal < cartTotal) return;

    const greedyResult = greedyCoinChange(cartTotal);
    const optimalResult = optimalCoinChange(cartTotal);

    setComparisonData({
      total: cartTotal,
      manualCoins: [...manualCoins],
      greedyResult,
      optimalResult,
    });

    removeCredits(cartTotal);
    cart.forEach(merc => recruitMercenary({ id: merc.id, name: merc.name, role: merc.role, ap: merc.ap }));

    setCart([]);
    setView('result');
  };

  const backToCatalog = () => {
    setView('catalog');
    setComparisonData(null);
  };

  // ===== CATALOG VIEW =====
  if (view === 'catalog') {
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
          Monte seu esquadrão! Adicione mercenários ao carrinho e pague com moedas ({AVAILABLE_COINS.join(', ')}). Tente usar o mínimo de moedas!
        </p>

        <div className="flex-col gap-2" style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {mercenaryRoster.map((merc) => {
            const recruited = alreadyRecruited.has(merc.id);
            const inCartAlready = inCart.has(merc.id);
            const disabled = recruited || inCartAlready;

            return (
              <div key={merc.id} className="sci-card" style={disabled ? { opacity: 0.5 } : {}}>
                <div>
                  <h3 className="flex align-center gap-2" style={{ color: '#c084fc' }}>
                    <Cpu size={14} /> {merc.name}
                  </h3>
                  <div className="sci-text-xs sci-text-muted mt-1">
                    Classe: {merc.role} | AP: {merc.ap}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(merc)}
                  disabled={disabled}
                  className="sci-btn"
                  style={!disabled ? { color: '#c084fc', borderColor: '#c084fc', backgroundColor: 'rgba(192, 132, 252, 0.1)' } : {}}
                >
                  {recruited ? 'Recrutado' : inCartAlready ? 'No Carrinho' : <><Plus size={14} /> {merc.cost} C</>}
                </button>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="cart-section">
            <h3 className="sci-text-sm sci-text-accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.75rem 0' }}>
              Carrinho ({cart.length})
            </h3>
            <div className="flex-col gap-2">
              {cart.map(merc => (
                <div key={merc.id} className="cart-item">
                  <span className="sci-text-sm">{merc.name} <span className="sci-text-muted">({merc.role})</span></span>
                  <div className="flex align-center gap-2">
                    <span className="sci-text-yellow sci-text-sm">{merc.cost} C</span>
                    <button onClick={() => removeFromCart(merc.id)} className="cart-remove-btn">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <span className="sci-text-sm" style={{ fontWeight: 'bold' }}>Total: <span className="sci-text-yellow">{cartTotal} C</span></span>
              <button
                onClick={startPayment}
                disabled={cartTotal > credits}
                className="sci-btn primary"
                style={{ padding: '0.5rem 1rem' }}
              >
                <CreditCard size={16} /> Pagar com Moedas
              </button>
            </div>
            {cartTotal > credits && (
              <div className="msg-box alert" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                <ShieldAlert size={16} /> Créditos insuficientes! Faltam {cartTotal - credits} C.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ===== PAYMENT VIEW =====
  if (view === 'payment') {
    const remaining = cartTotal - manualTotal;
    const isComplete = manualTotal >= cartTotal;

    return (
      <div className="sci-panel">
        <div className="flex-between mb-4">
          <h2 className="sci-title">
            <Coins size={20} /> Pagamento Manual
          </h2>
          <button onClick={() => { setView('catalog'); setManualCoins([]); }} className="sci-btn" style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={14} /> Voltar
          </button>
        </div>

        <p className="sci-desc">
          Pague <strong style={{ color: '#facc15' }}>{cartTotal} C</strong> usando moedas de {AVAILABLE_COINS.join(', ')}.
          Tente usar o <strong>menor número de moedas</strong> possível!
        </p>

        <div className="coin-selector">
          {AVAILABLE_COINS.map(coin => (
            <button
              key={coin}
              onClick={() => addCoin(coin)}
              disabled={isComplete}
              className="coin-btn"
            >
              <span className="coin-value">{coin}</span>
              <span className="coin-label">crédito{coin > 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>

        <div className="coins-display">
          <h4 className="sci-text-xs sci-text-muted" style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
            Moedas selecionadas ({manualCoins.length}):
          </h4>
          <div className="coins-row">
            {manualCoins.length === 0 ? (
              <span className="sci-text-xs sci-text-muted" style={{ fontStyle: 'italic' }}>Clique nas moedas acima para pagar...</span>
            ) : (
              manualCoins.map((coin, idx) => (
                <button key={idx} onClick={() => removeCoin(idx)} className="coin-chip" title="Clique para remover">
                  {coin}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="payment-progress">
          <div className="payment-bar-track">
            <div
              className="payment-bar-fill"
              style={{ width: `${Math.min(100, (manualTotal / cartTotal) * 100)}%` }}
            />
          </div>
          <div className="flex-between sci-text-sm" style={{ marginTop: '0.5rem' }}>
            <span>Pago: <span className={isComplete ? 'sci-text-success' : 'sci-text-yellow'}>{manualTotal} C</span></span>
            <span>
              {isComplete
                ? <span className="sci-text-success">✓ Completo!</span>
                : <span>Faltam: <span className="sci-text-alert">{remaining} C</span></span>
              }
            </span>
          </div>
        </div>

        {isComplete && (
          <button onClick={confirmPayment} className="sci-btn primary" style={{ width: '100%', marginTop: '1rem' }}>
            <Check size={18} /> Confirmar Pagamento ({manualCoins.length} moedas)
          </button>
        )}
      </div>
    );
  }

  // ===== RESULT VIEW =====
  if (view === 'result' && comparisonData) {
    const { total, manualCoins: mc, greedyResult, optimalResult } = comparisonData;
    const playerCoins = mc.length;
    const wasPlayerOptimal = playerCoins === optimalResult.totalCoins;
    const wasGreedyOptimal = greedyResult.totalCoins === optimalResult.totalCoins;

    return (
      <div className="sci-panel">
        <div className="flex-between mb-4">
          <h2 className="sci-title" style={{ color: 'var(--color-success)' }}>
            <Check size={20} /> Compra Finalizada!
          </h2>
        </div>

        <p className="sci-desc">
          Veja como sua seleção de moedas se compara com o algoritmo guloso e a solução ótima para pagar <strong style={{ color: '#facc15' }}>{total} C</strong>:
        </p>

        <div className="comparison-grid">
          <div className={`comparison-card ${wasPlayerOptimal ? 'optimal' : ''}`}>
            <h4>Sua Solução</h4>
            <div className="comparison-coins">{playerCoins} moedas</div>
            <div className="sci-text-xs sci-text-muted">[{[...mc].sort((a, b) => b - a).join(', ')}]</div>
            {wasPlayerOptimal && <span className="comparison-badge success">Ótimo!</span>}
            {!wasPlayerOptimal && <span className="comparison-badge warning">Sub-ótimo</span>}
          </div>

          <div className={`comparison-card ${wasGreedyOptimal ? 'optimal' : 'suboptimal'}`}>
            <h4>Algoritmo Guloso</h4>
            <div className="comparison-coins">{greedyResult.totalCoins} moedas</div>
            <div className="sci-text-xs sci-text-muted">[{greedyResult.coinsUsed.join(', ')}]</div>
            {wasGreedyOptimal && <span className="comparison-badge success">Ótimo!</span>}
            {!wasGreedyOptimal && <span className="comparison-badge warning">Sub-ótimo!</span>}
          </div>

          <div className="comparison-card optimal">
            <h4>Solução Ótima (DP)</h4>
            <div className="comparison-coins">{optimalResult.totalCoins} moedas</div>
            <div className="sci-text-xs sci-text-muted">[{optimalResult.coinsUsed.join(', ')}]</div>
            <span className="comparison-badge success">Referência</span>
          </div>
        </div>

        {!wasGreedyOptimal && (
          <div className="msg-box warning" style={{ marginTop: '1rem' }}>
            <ShieldAlert size={16} />
            <span>O sistema de moedas (1, 7, 20) é <strong>não-canônico</strong>! O algoritmo guloso usa {greedyResult.totalCoins} moedas, mas o ótimo precisa de apenas {optimalResult.totalCoins}.</span>
          </div>
        )}

        <button onClick={backToCatalog} className="sci-btn" style={{ width: '100%', marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Voltar ao Catálogo
        </button>
      </div>
    );
  }

  return null;
};
