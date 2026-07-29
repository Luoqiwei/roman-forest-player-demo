import { Leaf, Timer } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { formatTime, getNextStage, getStageConfig } from '../lib/demoLogic';
import styles from './GrowthProgress.module.css';

export function GrowthProgress() {
  const { treeStage, treeTheme, playedSeconds } = useDemo();
  const current = getStageConfig(treeStage, treeTheme);
  const next = getNextStage(treeStage, treeTheme);
  const start = current.minSeconds;
  const end = next?.minSeconds ?? 60;
  const percentage = next ? Math.min(100, ((playedSeconds - start) / (end - start)) * 100) : 100;

  return (
    <section className={styles.card}>
      <div className={styles.meta}>
        <span><Leaf size={14} /> {current.name}</span>
        <span><Timer size={14} /> 陪伴 {formatTime(playedSeconds)}</span>
      </div>
      <div className={styles.track}><i style={{ width: `${percentage}%` }} /></div>
      <p>{next ? `再听 ${Math.max(0, Math.ceil(next.minSeconds - playedSeconds))} 秒，解锁「${next.name}」` : '罗曼音乐树已经完全盛开'}</p>
    </section>
  );
}
