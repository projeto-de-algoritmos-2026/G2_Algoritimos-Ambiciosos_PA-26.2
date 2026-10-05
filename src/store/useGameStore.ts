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
  
  // Tutorial State
  tutorialStep: number;
  
  // Ações de Transição e Gestão
  setPhase: (phase: GamePhase) => void;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  setCredits: (amount: number) => void;
  recruitMercenary: (merc: Mercenary) => void;
  removeMercenary: (id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (id: string) => void;
  setInventory: (items: InventoryItem[]) => void;
  clearInventory: () => void;
  setAvailableMissions: (missions: Mission[]) => void;
  nextTutorialStep: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPhase: 'PHASE_1_DASHBOARD',
  credits: 200, // Créditos iniciais (aumentados para mais liberdade de escolha)
  mercenaries: [],
  inventory: [],
  availableMissions: [],
  tutorialStep: 0,

  setPhase: (phase) => set({ currentPhase: phase }),
  
  addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
  
  removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  
  setCredits: (amount) => set({ credits: amount }),
  
  recruitMercenary: (merc) => set((state) => ({ mercenaries: [...state.mercenaries, merc] })),
  
  removeMercenary: (id) => set((state) => ({ mercenaries: state.mercenaries.filter(m => m.id !== id) })),
  
  addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  
  removeInventoryItem: (id) => set((state) => ({ inventory: state.inventory.filter(i => i.id !== id) })),
  
  setInventory: (items) => set({ inventory: items }),
  
  clearInventory: () => set({ inventory: [] }),
  
  setAvailableMissions: (missions) => set({ availableMissions: missions }),
  
  nextTutorialStep: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
}));
