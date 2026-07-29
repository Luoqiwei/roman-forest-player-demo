import { candyStages, dolls, pixelStages } from '../data/demoData';
import type { DollId, PersistedDemoState, TreeStage, TreeTheme } from '../types/demo';

export const STORAGE_KEY = 'roman-forest-demo:v1';

export function getTreeStages(theme: TreeTheme = 'pixel') {
  return theme === 'candy' ? candyStages : pixelStages;
}

export function getStageBySeconds(seconds: number, theme: TreeTheme = 'pixel'): TreeStage {
  const stages = getTreeStages(theme);
  return [...stages].reverse().find((stage) => seconds >= stage.minSeconds)?.stage ?? 1;
}

export function getStageConfig(stage: TreeStage, theme: TreeTheme = 'pixel') {
  const stages = getTreeStages(theme);
  return stages.find((item) => item.stage === stage) ?? stages[0];
}

export function getNextStage(stage: TreeStage, theme: TreeTheme = 'pixel') {
  const stages = getTreeStages(theme);
  return stages.find((item) => item.stage === stage + 1) ?? null;
}

export function loadPersistedState(storage: Pick<Storage, 'getItem'> = localStorage): PersistedDemoState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDemoState;
    if (parsed.version !== 1 || !Array.isArray(parsed.collectedDolls)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedState(value: PersistedDemoState, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function chooseReward(collected: DollId[], preferred?: DollId): DollId {
  if (preferred) return preferred;
  if (collected.length === 0) return 'futa';
  const available = dolls.map((doll) => doll.id).filter((id) => !collected.includes(id));
  if (available.length === 0) return dolls[Math.floor(Math.random() * dolls.length)].id;
  return available[Math.floor(Math.random() * available.length)];
}

export function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}
