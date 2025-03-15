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
  time: number;
  diskCount: number;
  onReset: () => void;
  onDiskCountChange: (count: number) => void;
}

export interface CanvasProps {
  towers: Towers;
  selectedDisk: SelectedDisk | null;
  onDiskClick: (towerIndex: number) => void;
}