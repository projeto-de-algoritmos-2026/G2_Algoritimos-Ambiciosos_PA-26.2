import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Info } from 'lucide-react';

const steps = [
  "Bem-vindo à Mother Ship! Vá ao Mercado Negro, escolha mercenários e adicione ao carrinho.",
  "Agora vá ao Quadro de Contratos. Arraste os contratos para reordená-los e minimize o atraso!",
  "Prepare o Drop Pod manualmente. Escolha os suprimentos, ajuste frações e maximize o valor de combate.",
  "Você está pronto! Clique em 'Deploy para Superfície' para ir ao combate.",
  "Chegamos ao campo de batalha. Escolha um recruta e clique em 'Calcular Rota Segura' para ele avançar.",
  "Por fim, selecione manualmente os ataques na timeline. Evite sobreposições e maximize seus ataques!",
  "Parabéns! Você concluiu o tutorial. Use os botões 'Comparar' para ver como a IA faria!"
];

export const TutorialBox: React.FC = () => {
  const { tutorialStep, nextTutorialStep } = useGameStore();

  if (tutorialStep >= steps.length) return null;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-box sci-panel" style={{ margin: 0 }}>
        <h3 className="sci-title"><Info size={20} /> Tutorial ({tutorialStep + 1}/{steps.length})</h3>
        <p className="sci-desc" style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#fff', lineHeight: 1.4 }}>
          {steps[tutorialStep]}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={nextTutorialStep} className="sci-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            {tutorialStep === steps.length - 1 ? 'Concluir' : 'Pular Etapa'}
          </button>
        </div>
      </div>
    </div>
  );
};
