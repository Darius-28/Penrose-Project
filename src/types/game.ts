export type Disk = number;
export type Tower = Disk[];
export type Towers = [Tower, Tower, Tower];

export interface SelectedDisk {
  tower: number;
  disk: number;
}

export interface GameState {
  towers: Towers;
  moves: number;
  selectedDisk: SelectedDisk | null;
  isGameComplete: boolean;
}

export enum GameMode {
  Arcade = 'arcade',
  Normal = 'normal',
  Dynamic = 'dynamic'
}

export enum Difficulty {
  Easy = 3,
  Medium = 4,
  Hard = 5,
  Expert = 6,
  Master = 7
}

export interface PlayerStats {
  id: string;
  name: string;
  recentGames: GameResult[];
  skillLevel: number; // 1-5, used for Dynamic mode
  currentDifficulty: Difficulty; // For Dynamic mode
}

export interface GameResult {
  difficulty: Difficulty;
  moves: number;
  time: number;
  completedAt: Date;
  optimalMoves: number;
  moveEfficiency: number;
  gameMode: GameMode;
}
export interface GameSettings {
  mode: GameMode;
  playerName: string;
  difficulty?: Difficulty;
}

export interface Move {
  fromTower: number;
  toTower: number;
  disk: number;
}

export interface GameControls {
  moves: number;
  time: string;
  diskCount: number;
  onReset: () => void;
  onDiskCountChange: (count: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  gameMode: GameMode;
  playerName: string;
}

export interface CanvasProps {
  towers: Towers;
  selectedDisk: SelectedDisk | null;
  onDiskMove: (fromTower: number, toTower: number) => void;
}

export interface WinModalProps {
  moves: number;
  time: string;
  onRestart: () => void;
  isOpen: boolean;
  gameMode: GameMode;
  playerName: string;
  difficulty?: Difficulty;
  optimalMoves: number;
  moveEfficiency: number;
}

export interface LeaderboardEntry extends GameResult {
  playerName: string;
}

export interface DynamicDifficultyConfig {
  minSkillLevel: number; // 1
  maxSkillLevel: number; // 5
  difficultyThresholds: {
    moveEfficiency: number;
    timeEfficiency: number;
  };
  adjustmentFactors: {
    increase: number; // How much to increase difficulty when player performs well
    decrease: number; // How much to decrease difficulty when player struggles
  };
}