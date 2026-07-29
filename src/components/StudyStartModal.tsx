import { motion } from 'framer-motion';
import { Play, Timer, X } from 'lucide-react';
import styles from './Overlay.module.css';

interface StudyStartModalProps {
  onConfirm(): void;
  onCancel(): void;
}

export function StudyStartModal({ onConfirm, onCancel }: StudyStartModalProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="开启自习确认">
      <motion.div
        className={`${styles.modal} ${styles.studyStart}`}
        initial={{ opacity: 0, scale: .9, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .96, y: 12 }}
      >
        <button className={styles.close} aria-label="取消开启自习" onClick={onCancel}>
          <X size={20} />
        </button>

        <div className={styles.studyStartIcon}><Timer size={28} /></div>
        <h2>开启自习模式？</h2>
        <p>音乐播放时将累计专注时间，陪伴音乐树逐步成长。</p>

        <div className={styles.modalActions}>
          <button className={styles.secondary} onClick={onCancel}>暂不开启</button>
          <button className={styles.primary} onClick={onConfirm}>
            <Play size={16} fill="currentColor" />开启自习
          </button>
        </div>
      </motion.div>
    </div>
  );
}
