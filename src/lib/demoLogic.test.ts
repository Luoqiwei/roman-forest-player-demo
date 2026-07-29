import { describe, expect, it } from 'vitest';
import { chooseReward, getStageBySeconds, loadPersistedState, savePersistedState, STORAGE_KEY } from './demoLogic';

describe('成长阶段', () => {
  it.each([[0, 1], [179, 1], [180, 2], [480, 3], [1080, 4], [1800, 5], [3600, 5]])('%s 秒对应阶段 %s', (seconds, stage) => {
    expect(getStageBySeconds(seconds)).toBe(stage);
  });
});

describe('奖励', () => {
  it('首次固定获得福塔', () => expect(chooseReward([])).toBe('futa'));
  it('指定奖励优先', () => expect(chooseReward([], 'sulong')).toBe('sulong'));
  it('不会从未集齐列表中重复选择已有玩偶', () => expect(chooseReward(['futa', 'happy-teeth', 'shalala', 'green'])).toBe('sulong'));
});

describe('持久化', () => {
  it('保存并恢复状态', () => {
    const data = new Map<string, string>();
    const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) };
    savePersistedState({ version: 1, playedSeconds: 500, treeStage: 3, collectedDolls: ['futa'] }, storage);
    expect(data.has(STORAGE_KEY)).toBe(true);
    expect(loadPersistedState(storage)).toEqual({ version: 1, playedSeconds: 500, treeStage: 3, collectedDolls: ['futa'] });
  });
});
