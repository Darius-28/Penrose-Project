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

export interface GameControls {
  moves: number;
  time: string;  // Changed from number to string
  diskCount: number;
  onReset: () => void;
  onDiskCountChange: (count: number) => void;
}

export interface CanvasProps {
  towers: number[][];
  selectedDisk: SelectedDisk | null;
  onDiskMove: (fromTower: number, toTower: number) => void;
}

export interface WinModalProps {
  moves: number;
  time: string;
  onRestart: () => void;
  isOpen: boolean;
}