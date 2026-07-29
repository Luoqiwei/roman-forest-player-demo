export type TreeStage = 1 | 2 | 3 | 4 | 5;
export type TreeTheme = 'pixel' | 'candy';
export type DollId = 'futa' | 'happy-teeth' | 'shalala' | 'green' | 'sulong';

export interface DemoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playedSeconds: number;
  treeStage: TreeStage;
  treeTheme: TreeTheme;
  collectedDolls: DollId[];
  shareModalOpen: boolean;
  rewardModalOpen: boolean;
  selectedRewardId: DollId | null;
  isStudying: boolean;
}

export interface PersistedDemoState {
  version: 1;
  playedSeconds: number;
  treeStage: TreeStage;
  treeTheme?: TreeTheme;
  collectedDolls: DollId[];
}

export interface StageConfig {
  stage: TreeStage;
  name: string;
  minSeconds: number;
  message: string;
  asset: string;
  animationFrames?: string[];
  renderMode?: 'pixelated' | 'smooth';
  albumPresentation?: {
    scale: number;
    offsetX?: number;
    offsetY?: number;
  };
}

export interface DollConfig {
  id: DollId;
  name: string;
  description: string;
  asset: string;
  color: string;
}
