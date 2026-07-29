import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { chooseReward, getStageBySeconds, getTreeStages, loadPersistedState, savePersistedState } from '../lib/demoLogic';
import type { DemoState, DollId, TreeStage, TreeTheme } from '../types/demo';

type Action =
  | { type: 'SET_PLAYING'; value: boolean }
  | { type: 'SET_AUDIO_TIME'; currentTime: number; duration?: number }
  | { type: 'ADD_GROWTH'; seconds: number }
  | { type: 'SET_STAGE'; stage: TreeStage }
  | { type: 'SET_TREE_THEME'; theme: TreeTheme }
  | { type: 'START_STUDYING' }
  | { type: 'STOP_STUDYING' }
  | { type: 'OPEN_SHARE'; value: boolean }
  | { type: 'REWARD'; dollId: DollId }
  | { type: 'CLOSE_REWARD' }
  | { type: 'RESET' };

interface DemoContextValue extends DemoState {
  upgradeStage: TreeStage | null;
  resetVersion: number;
  setPlaying(value: boolean): void;
  setAudioTime(currentTime: number, duration?: number): void;
  addGrowth(seconds: number): void;
  setStage(stage: TreeStage): void;
  setTreeTheme(theme: TreeTheme): void;
  startStudying(): void;
  stopStudying(): void;
  setShareOpen(value: boolean): void;
  simulateShare(preferred?: DollId): void;
  closeReward(): void;
  dismissUpgrade(): void;
  reset(): void;
}

const persisted = typeof window === 'undefined' ? null : loadPersistedState();
const initialTreeTheme = persisted?.treeTheme ?? 'candy';
const initialPlayedSeconds = persisted?.playedSeconds ?? 0;
const initialState: DemoState = {
  isPlaying: false,
  currentTime: 0,
  duration: 198,
  playedSeconds: initialPlayedSeconds,
  treeStage: getStageBySeconds(initialPlayedSeconds, initialTreeTheme),
  treeTheme: initialTreeTheme,
  collectedDolls: persisted?.collectedDolls ?? [],
  shareModalOpen: false,
  rewardModalOpen: false,
  selectedRewardId: null,
  isStudying: false,
};

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'SET_PLAYING': return { ...state, isPlaying: action.value };
    case 'SET_AUDIO_TIME': return { ...state, currentTime: action.currentTime, duration: action.duration || state.duration };
    case 'ADD_GROWTH': {
      const playedSeconds = Math.max(0, state.playedSeconds + action.seconds);
      return { ...state, playedSeconds, treeStage: getStageBySeconds(playedSeconds, state.treeTheme) };
    }
    case 'SET_STAGE': {
      const stageConfig = getTreeStages(state.treeTheme).find((s) => s.stage === action.stage);
      return { ...state, treeStage: action.stage, playedSeconds: stageConfig?.minSeconds ?? 0 };
    }
    case 'SET_TREE_THEME': return {
      ...state,
      treeTheme: action.theme,
      treeStage: getStageBySeconds(state.playedSeconds, action.theme),
    };
    case 'START_STUDYING': return { ...state, isStudying: true, playedSeconds: 0, treeStage: 1 };
    case 'STOP_STUDYING': return { ...state, isStudying: false, playedSeconds: 0, treeStage: 1 };
    case 'OPEN_SHARE': return { ...state, shareModalOpen: action.value };
    case 'REWARD': return {
      ...state,
      shareModalOpen: false,
      rewardModalOpen: true,
      selectedRewardId: action.dollId,
      collectedDolls: state.collectedDolls.includes(action.dollId)
        ? state.collectedDolls
        : [...state.collectedDolls, action.dollId],
    };
    case 'CLOSE_REWARD': return { ...state, rewardModalOpen: false, selectedRewardId: null };
    case 'RESET': return { ...initialState, playedSeconds: 0, treeStage: 1, collectedDolls: [], currentTime: 0 };
  }
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [upgradeStage, setUpgradeStage] = useState<TreeStage | null>(null);
  const [resetVersion, setResetVersion] = useState(0);
  const previousStageRef = useRef<TreeStage>(state.treeStage);
  const previousThemeRef = useRef<TreeTheme>(state.treeTheme);

  useEffect(() => {
    savePersistedState({
      version: 1,
      playedSeconds: state.playedSeconds,
      treeStage: state.treeStage,
      treeTheme: state.treeTheme,
      collectedDolls: state.collectedDolls,
    });
  }, [state.playedSeconds, state.treeStage, state.treeTheme, state.collectedDolls]);

  useEffect(() => {
    const themeChanged = state.treeTheme !== previousThemeRef.current;
    if (!themeChanged && state.treeStage > previousStageRef.current) setUpgradeStage(state.treeStage);
    previousStageRef.current = state.treeStage;
    previousThemeRef.current = state.treeTheme;
  }, [state.treeStage, state.treeTheme]);

  useEffect(() => {
    if (!upgradeStage) return;
    const timer = window.setTimeout(() => setUpgradeStage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [upgradeStage]);

  // 自习计时：翻转专辑后开始，仅在音乐播放且页面可见时累计。
  const isStudyingRef = useRef(state.isStudying);
  const isPlayingRef = useRef(state.isPlaying);
  useEffect(() => { isStudyingRef.current = state.isStudying; }, [state.isStudying]);
  useEffect(() => { isPlayingRef.current = state.isPlaying; }, [state.isPlaying]);

  useEffect(() => {
    let last = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - last) / 1000;
      last = now;
      if (
        document.visibilityState === 'visible'
        && isStudyingRef.current
        && isPlayingRef.current
      ) {
        dispatch({ type: 'ADD_GROWTH', seconds: elapsed });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo<DemoContextValue>(() => ({
    ...state,
    upgradeStage,
    resetVersion,
    setPlaying: (value) => dispatch({ type: 'SET_PLAYING', value }),
    setAudioTime: (currentTime, duration) => dispatch({ type: 'SET_AUDIO_TIME', currentTime, duration }),
    addGrowth: (seconds) => dispatch({ type: 'ADD_GROWTH', seconds }),
    setStage: (stage) => dispatch({ type: 'SET_STAGE', stage }),
    setTreeTheme: (theme) => dispatch({ type: 'SET_TREE_THEME', theme }),
    startStudying: () => dispatch({ type: 'START_STUDYING' }),
    stopStudying: () => dispatch({ type: 'STOP_STUDYING' }),
    setShareOpen: (value) => dispatch({ type: 'OPEN_SHARE', value }),
    simulateShare: (preferred) => dispatch({ type: 'REWARD', dollId: chooseReward(state.collectedDolls, preferred) }),
    closeReward: () => dispatch({ type: 'CLOSE_REWARD' }),
    dismissUpgrade: () => setUpgradeStage(null),
    reset: () => {
      setUpgradeStage(null);
      setResetVersion((value) => value + 1);
      dispatch({ type: 'RESET' });
    },
  }), [state, upgradeStage, resetVersion]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo 必须在 DemoProvider 中使用');
  return value;
}
