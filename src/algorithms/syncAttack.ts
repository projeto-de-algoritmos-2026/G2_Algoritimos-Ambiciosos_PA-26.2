/**
 * Mecânica 5: Ataque Sincronizado (Interval Scheduling)
 * O inimigo tem janelas de vulnerabilidade. O jogador seleciona múltiplos ataques que duram um tempo específico.
 * Validamos os ataques para garantir que o máximo possível se encaixe sem sobreposição
 * utilizando a estratégia de "Término Mais Cedo" (Earliest Finish Time First).
 */

export interface AttackAction {
  id: string;
  name: string;
  start: number;
  end: number;
}

export function maximizeAttacks(attacks: AttackAction[]): AttackAction[] {
  // A estratégia gulosa seleciona o ataque que termina primeiro (Earliest Finish Time First)
  // para deixar mais espaço livre para os próximos ataques.
  const sortedAttacks = [...attacks].sort((a, b) => a.end - b.end);
  
  const selectedAttacks: AttackAction[] = [];
  let lastEndTime = 0;

  for (const attack of sortedAttacks) {
    if (attack.start >= lastEndTime) {
      selectedAttacks.push(attack);
      lastEndTime = attack.end;
    }
  }

  return selectedAttacks;
}
