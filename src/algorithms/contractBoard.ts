import type { Mission } from '../store/useGameStore';

/**
 * Mecânica 1: O Quadro de Contratos (Minimize Lateness / EDF - Earliest Deadline First)
 * Ordena as missões priorizando as com o menor prazo (deadline) primeiro para evitar penalidades.
 */
export function recommendMissions(missions: Mission[]): Mission[] {
  // A estratégia gulosa para minimizar o atraso máximo é ordenar pelos prazos (Earliest Deadline First)
  return [...missions].sort((a, b) => a.deadline - b.deadline);
}

/**
 * Calcula o atraso (lateness) para uma dada ordenação de missões.
 * Cada missão é executada sequencialmente, e o atraso é max(0, finishTime - deadline).
 */
export interface LatenessResult {
  totalLateness: number;
  maxLateness: number;
  details: { mission: Mission; finishTime: number; lateness: number }[];
}

export function calculateLateness(missions: Mission[]): LatenessResult {
  let currentTime = 0;
  let totalLateness = 0;
  let maxLateness = 0;
  const details: { mission: Mission; finishTime: number; lateness: number }[] = [];

  for (const mission of missions) {
    currentTime += mission.duration;
    const lateness = Math.max(0, currentTime - mission.deadline);
    totalLateness += lateness;
    maxLateness = Math.max(maxLateness, lateness);
    details.push({ mission, finishTime: currentTime, lateness });
  }

  return { totalLateness, maxLateness, details };
}
