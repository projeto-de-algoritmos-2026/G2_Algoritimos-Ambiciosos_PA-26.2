import { create } from 'zustand';

export type GamePhase = 'PHASE_1_DASHBOARD' | 'PHASE_2_TACTICAL';

export interface Mercenary {
  id: string;
  name: string;
  role: string;
  ap: number; // Action points (Combustível)
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  combatValue: number;
}

export interface Mission {
  id: string;
  title: string;
  duration: number;
  deadline: number;
}

interface GameState {
  currentPhase: GamePhase;
  credits: number;
  mercenaries: Mercenary[];
  inventory: InventoryItem[];
  availableMissions: Mission[];
  
  // Ações de Transição e Gestão
  setPhase: (phase: GamePhase) => void;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  recruitMercenary: (merc: Mercenary) => void;
  addInventoryItem: (item: InventoryItem) => void;
  setAvailableMissions: (missions: Mission[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPhase: 'PHASE_1_DASHBOARD',
  credits: 150, // Créditos iniciais
  mercenaries: [],
  inventory: [],
  availableMissions: [],

  setPhase: (phase) => set({ currentPhase: phase }),
  
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  
  removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  
  recruitMercenary: (merc) => set((state) => ({ mercenaries: [...state.mercenaries, merc] })),
  
  addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  
  setAvailableMissions: (missions) => set({ availableMissions: missions }),
}));
