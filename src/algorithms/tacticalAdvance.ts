/**
 * Mecânica 4: Avanço sob Fogo (Problema do Caminhoneiro / Minimum Stops)
 * Calcula as paradas seguras exatas garantindo o menor número de turnos expostos,
 * onde o Action Point (AP) atua como a "capacidade do tanque".
 */

// distances: Array com as posições de cada posto seguro a partir do início
// ex: [10, 20, 30, 40]
export function calculateSafeStops(safePosts: number[], maxAP: number, targetDistance: number): number[] {
  const stops: number[] = [];
  let currentPos = 0;
  let currentStopIndex = 0;

  // Inclui o alvo na lista de distâncias caso não esteja explicitamente como posto
  const allStops = [...safePosts];
  if (!allStops.includes(targetDistance)) {
    allStops.push(targetDistance);
  }
  
  // Garante a ordenação das paradas
  allStops.sort((a, b) => a - b);

  while (currentPos + maxAP < targetDistance) {
    let nextStopIndex = currentStopIndex;

    // A estratégia gulosa é: Avançar até a parada segura mais distante possível
    // que ainda esteja dentro do nosso limite de Action Points.
    while (
      nextStopIndex < allStops.length && 
      allStops[nextStopIndex] <= currentPos + maxAP
    ) {
      nextStopIndex++;
    }

    nextStopIndex--; // Retrocede para a última parada válida que conseguimos alcançar

    if (nextStopIndex < currentStopIndex || allStops[nextStopIndex] === currentPos) {
      // O próximo posto seguro é inalcançável (AP insuficiente)
      throw new Error("Missão Impossível! AP insuficiente para alcançar a próxima cobertura.");
    }

    currentStopIndex = nextStopIndex;
    currentPos = allStops[currentStopIndex];
    stops.push(currentPos);
  }

  return stops;
}
