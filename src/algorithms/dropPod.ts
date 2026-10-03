/**
 * Mecânica 3: Drop Pod Loadout (Mochila Fracionária / Fractional Knapsack)
 * Prioriza itens pela razão de Valor / Peso.
 */

export interface PodItem {
  id: string;
  name: string;
  weight: number;
  combatValue: number;
}

export interface PodLoadoutResult {
  selectedItems: { item: PodItem; fraction: number }[];
  totalValue: number;
  totalWeight: number;
}

export function optimizeDropPod(items: PodItem[], weightLimit: number): PodLoadoutResult {
  // Ordena os itens pela razão valor/peso em ordem decrescente (A estratégia gulosa)
  const sortedItems = [...items].sort(
    (a, b) => (b.combatValue / b.weight) - (a.combatValue / a.weight)
  );

  let remainingWeight = weightLimit;
  let totalValue = 0;
  const selectedItems: { item: PodItem; fraction: number }[] = [];

  for (const item of sortedItems) {
    if (remainingWeight === 0) break;

    if (item.weight <= remainingWeight) {
      // Tem espaço para o item inteiro
      selectedItems.push({ item, fraction: 1 });
      remainingWeight -= item.weight;
      totalValue += item.combatValue;
    } else {
      // Pega apenas a fração que cabe no espaço restante
      const fraction = remainingWeight / item.weight;
      selectedItems.push({ item, fraction });
      totalValue += item.combatValue * fraction;
      remainingWeight = 0;
    }
  }

  return {
    selectedItems,
    totalValue,
    totalWeight: weightLimit - remainingWeight
  };
}
