import type { CSSProperties } from 'react';
import { getNextStage, getStageConfig } from '../lib/demoLogic';
import type { TreeStage } from '../types/demo';
import styles from './StudyGrowthProgress.module.css';
import { useDemo } from '../context/DemoContext';

interface StudyGrowthProgressProps {
  treeStage: TreeStage;
  playedSeconds: number;
}

type ProgressStyle = CSSProperties & {
  '--growth-progress': string;
};

function formatRemaining(seconds: number) {
  if (seconds < 60) return `${Math.max(1, Math.ceil(seconds))} 秒`;
  return `${Math.ceil(seconds / 60)} 分钟`;
}

export function StudyGrowthProgress({ treeStage, playedSeconds }: StudyGrowthProgressProps) {
  const { treeTheme } = useDemo();
  const stage = getStageConfig(treeStage, treeTheme);
  const nextStage = getNextStage(treeStage, treeTheme);
  const stageDuration = nextStage ? nextStage.minSeconds - stage.minSeconds : 1;
  const stageElapsed = Math.max(0, playedSeconds - stage.minSeconds);
  const progress = nextStage ? Math.min(1, stageElapsed / stageDuration) : 1;
  const remaining = nextStage ? Math.max(0, nextStage.minSeconds - playedSeconds) : 0;
  const progressStyle: ProgressStyle = { '--growth-progress': `${progress * 100}%` };

  return (
    <section className={styles.progress} aria-label="音乐树成长进度" style={progressStyle}>
      <div className={styles.copy}>
        {nextStage ? (
          <span>距离下一阶段还需 <strong>{formatRemaining(remaining)}</strong></span>
        ) : (
          <span><strong>已成长至最终阶段</strong></span>
        )}
        <small>{Math.round(progress * 100)}%</small>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} />
        <span className={styles.thumb} />
        <img src={stage.asset} alt="" />
      </div>
    </section>
  );
}
