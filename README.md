# G2_Algoritmos-Ambiciosos

**Número da Lista**: 3<br>
**Conteúdo da Disciplina**: Algoritmos Ambiciosos

## Alunos
| Matrícula | Aluno |
| -- | -- |
| 241025274 | João Eduardo de Souza Leles |
| 241032500 | Giovani de Oliveira Teodoro Coelho |

## Sobre
Este projeto é uma aplicação interativa (com temática tática/espacial) focada na visualização e aplicação prática de **Algoritmos Ambiciosos (Gulosos)**. O jogador atua como um comandante passando por fases de planejamento (Dashboard) e execução (Tática), onde precisa tomar decisões estratégicas para maximizar resultados e minimizar perdas.

O objetivo principal é demonstrar a aplicação de heurísticas gulosas na resolução de problemas clássicos de otimização no mundo real e em jogos. O sistema comprova de forma visual quando essas estratégias encontram a solução global ótima com rapidez e quando falham intencionalmente (como no caso de moedas não-canônicas no mercado negro).

## Vídeo de apresentação
[Assistir ao Vídeo de Apresentação](https://drive.google.com/file/d/1gB3KyhPKStZqtXkHP_RGjaf0g-OHgFyt/view?usp=sharing)

## Instalação
**Linguagem**: TypeScript / JavaScript<br>
**Framework**: React + Vite

**Pré-requisitos**:
- Node.js
- npm

Para rodar o projeto localmente, execute os seguintes comandos no terminal, estando no diretório raiz do projeto:

```bash
# Instale as dependências do projeto
npm install

# Inicie o servidor local de desenvolvimento
npm run dev
```

## Uso
1. Após iniciar o servidor, abra o navegador no endereço exibido no terminal (geralmente `http://localhost:5173`).
2. O sistema é dividido em duas fases principais: **Dashboard de Planejamento** e **Fase Tática**.
3. Na fase de Dashboard, interaja com mecânicas como o **Quadro de Contratos** (para selecionar missões e visualizar multas de atraso) e o **Mercado Negro** (para comprar recursos com um sistema monetário peculiar).
4. Em seguida, prepare seu **Drop Pod** selecionando os melhores equipamentos antes de atingir a capacidade máxima.
5. Durante a Fase Tática, avance em campo aberto gerenciando paradas seguras e sincronize ataques contra o inimigo escolhendo as melhores janelas de vulnerabilidade.
6. A qualquer momento, explore os painéis de tutorial na interface para ler sobre o embasamento teórico de cada algoritmo rodando por trás do jogo.

## Outros
**Decisões e Regras dos Algoritmos**:

- **O Quadro de Contratos (Minimize Lateness)**: Ordena as missões priorizando as com o menor prazo de entrega (*Earliest Deadline First*) para minimizar a penalidade de atraso máxima em execução sequencial.
- **O Mercado Negro (Troco de Moedas)**: Utiliza a estratégia gulosa de selecionar sempre a maior moeda possível. Como o sistema de moedas do jogo não é canônico (`[20, 7, 1]`), o algoritmo guloso demonstra na prática como pode gastar mais moedas do que a solução ótima (que seria encontrada via Programação Dinâmica) em casos específicos.
- **Drop Pod Loadout (Mochila Fracionária / Fractional Knapsack)**: Prioriza alocar itens limitados no seu inventário tático com base na maior razão de `Valor de Combate / Peso`. Quando o espaço acaba, ele particiona o último item (frações) para aproveitar 100% da capacidade de peso do Drop Pod.
- **Avanço sob Fogo (Minimum Stops / Problema do Caminhoneiro)**: Avalia posições de postos de cobertura no mapa e instrui o avanço guloso até o abrigo mais distante alcançável dentro do limite de *Action Points* (AP), garantindo o menor número de turnos expostos ao inimigo.
- **Ataque Sincronizado (Interval Scheduling)**: Analisa janelas de ataque inimigo utilizando a estratégia de selecionar ataques que terminam mais cedo (*Earliest Finish Time First*). Isso maximiza o número total de golpes que podem ser desferidos na janela de vulnerabilidade sem que os ataques se sobreponham.
