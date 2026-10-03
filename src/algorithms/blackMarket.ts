/**
 * Mecânica 2: O Mercado Negro (Troco com Moedas não-canônicas)
 * O sistema tem moedas de valor 1, 7 e 20.
 * A função gulosa tenta usar a maior moeda possível primeiro.
 * Como o sistema não é canônico, o algoritmo guloso pode não ser o ótimo global,
 * gastando mais moedas do que o necessário intencionalmente em certos casos.
 */

export const AVAILABLE_COINS = [20, 7, 1]; // Sempre ordenado do maior pro menor pro algoritmo guloso

export interface CoinChangeResult {
  coinsUsed: number[];
  totalCoins: number;
}

// Algoritmo Guloso: Auto-Comprar (Pode não ser a melhor escolha matemática)
export function greedyCoinChange(amount: number): CoinChangeResult {
  let remaining = amount;
  const coinsUsed: number[] = [];

  for (const coin of AVAILABLE_COINS) {
    while (remaining >= coin) {
      remaining -= coin;
      coinsUsed.push(coin);
    }
  }

  return {
    coinsUsed,
    totalCoins: coinsUsed.length
  };
}

// Algoritmo de Programação Dinâmica (Ótimo): Para validar se o jogador escolheu melhor
export function optimalCoinChange(amount: number): CoinChangeResult {
  const dp = new Array(amount + 1).fill(Infinity);
  const coinUsed = new Array(amount + 1).fill(0);
  
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of AVAILABLE_COINS) {
      if (i >= coin && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        coinUsed[i] = coin;
      }
    }
  }

  const optimalCoins: number[] = [];
  let curr = amount;
  while (curr > 0) {
    optimalCoins.push(coinUsed[curr]);
    curr -= coinUsed[curr];
  }

  // Ordena as moedas retornadas para consistência
  optimalCoins.sort((a, b) => b - a);

  return {
    coinsUsed: optimalCoins,
    totalCoins: optimalCoins.length
  };
}
