import { AnimatePresence, motion } from 'framer-motion';
import { Music2, Sparkles } from 'lucide-react';
import { dolls } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import { getStageConfig } from '../lib/demoLogic';
import styles from './ForestScene.module.css';

const notePositions = [
  { left: '16%', top: '29%', delay: 0.2 },
  { left: '78%', top: '25%', delay: 1.2 },
  { left: '24%', top: '52%', delay: 2 },
  { left: '70%', top: '48%', delay: 2.8 },
];

export function ForestScene({ compact = false }: { compact?: boolean }) {
  const { treeStage, treeTheme, isPlaying, collectedDolls } = useDemo();
  const stage = getStageConfig(treeStage, treeTheme);
  const residents = collectedDolls.slice(-3).map((id) => dolls.find((doll) => doll.id === id)).filter(Boolean);

  return (
    <section className={`${styles.scene} ${styles[`stage${treeStage}`]} ${compact ? styles.compact : ''}`} aria-label="罗曼森林场景">
      <div className={styles.skyGlow} />
      <div className={`${styles.cloud} ${styles.cloudOne}`} />
      <div className={`${styles.cloud} ${styles.cloudTwo}`} />
      <div className={styles.forestBack} />
      <div className={styles.forestMid} />
      <div className={styles.ground} />
      <div className={styles.path} />

      <div className={styles.sign}>
        <Music2 size={14} />
        <span>ROMAN<br />FOREST</span>
      </div>

      <div className={styles.flowerPatchLeft}><i /><i /><i /></div>
      <div className={styles.flowerPatchRight}><i /><i /><i /></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${treeTheme}-${stage.stage}`}
          className={styles.treeAnchor}
          initial={{ opacity: 0, scale: 0.76, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.08, y: -8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        >
          <img src={stage.asset} className={`${styles.tree} ${stage.renderMode === 'smooth' ? styles.smoothTree : ''} ${isPlaying && stage.animationFrames?.length ? styles.treePlaying : ''}`} alt={`${stage.name}树形`} />
        </motion.div>
      </AnimatePresence>

      {residents.map((doll, index) => doll && (
        <motion.img
          key={doll.id}
          className={`${styles.resident} ${styles[`resident${index}`]}`}
          src={doll.asset}
          alt={doll.name}
          initial={{ opacity: 0, y: -60, rotate: -8 }}
          animate={{ opacity: 1, y: [0, -4, 0], rotate: 0 }}
          transition={{ y: { repeat: Infinity, duration: 2.4 + index * 0.3 }, opacity: { duration: 0.3 } }}
        />
      ))}

      {treeStage >= 4 && <div className={styles.lights}>{Array.from({ length: 7 }).map((_, index) => <i key={index} />)}</div>}
      {isPlaying && notePositions.map((note, index) => (
        <motion.span
          key={index}
          className={styles.musicNote}
          style={{ left: note.left, top: note.top }}
          initial={{ opacity: 0, y: 18, scale: 0.6 }}
          animate={{ opacity: [0, 0.9, 0], y: -42, x: [0, 6, -4], scale: [0.6, 1, 0.8] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: note.delay }}
        >♪</motion.span>
      ))}

      <div className={styles.foreground} />
      <div className={styles.stageBadge}><Sparkles size={12} /> 第 {treeStage} 阶段 · {stage.name}</div>
    </section>
  );
}
