import { Mission } from '../store/useGameStore';

/**
 * Mecânica 1: O Quadro de Contratos (Minimize Lateness / EDF - Earliest Deadline First)
 * Ordena as missões priorizando as com o menor prazo (deadline) primeiro para evitar penalidades.
 */
export function recommendMissions(missions: Mission[]): Mission[] {
  // A estratégia gulosa para minimizar o atraso máximo é ordenar pelos prazos (Earliest Deadline First)
  return [...missions].sort((a, b) => a.deadline - b.deadline);
}
