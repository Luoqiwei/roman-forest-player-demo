import { motion } from 'framer-motion';
import { RotateCcw, Share2, Sparkles, X } from 'lucide-react';
import { getStageConfig } from '../lib/demoLogic';
import { formatTime } from '../lib/demoLogic';
import type { TreeStage } from '../types/demo';
import { useDemo } from '../context/DemoContext';
import styles from './Overlay.module.css';

interface StudyExitModalProps {
  treeStage: TreeStage;
  studySeconds: number;
  onContinue(): void;
  onExit(): void;
  onShare(): void;
}

export function StudyExitModal({ treeStage, studySeconds, onContinue, onExit, onShare }: StudyExitModalProps) {
  const { treeTheme } = useDemo();
  const stage = getStageConfig(treeStage, treeTheme);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="退出自习确认">
      <motion.div className={styles.modal} initial={{ opacity: 0, scale: .94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 20 }}>
        <button className={styles.close} aria-label="继续自习" onClick={onContinue}><X size={20} /></button>

        <header className={styles.modalHeading}>
          <span><Sparkles size={16} /> 自习总结</span>
          <small>专注让音乐树悄然生长</small>
        </header>

        <div className={styles.studySummary}>
          <div className={styles.studyTreePreview}>
            <img src={stage.asset} alt={stage.name} />
          </div>
          <strong className={styles.studyStageName}>{stage.name}</strong>
          <p className={styles.studyStageDesc}>{stage.message}</p>
          <time className={styles.studyTime}>已自习 {formatTime(studySeconds)}</time>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.primary} onClick={onContinue}>
            <RotateCcw size={15} />继续自习
          </button>
          <button className={styles.secondary} onClick={onShare}>
            <Share2 size={15} />分享成果
          </button>
        </div>

        <button className={styles.exitLink} onClick={onExit}>退出自习</button>
      </motion.div>
    </div>
  );
}
