import { ChevronDown, FastForward, Gift, RotateCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { dolls } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import { getTreeStages } from '../lib/demoLogic';
import type { DollId, TreeStage } from '../types/demo';
import overlayStyles from './Overlay.module.css';
import styles from './DemoPanel.module.css';

export function DemoPanel({ open, onClose }: { open: boolean; onClose(): void }) {
  const { treeStage, treeTheme, setTreeTheme, addGrowth, setStage, simulateShare, reset } = useDemo();
  const stages = getTreeStages(treeTheme);
  if (!open) return null;

  return (
    <div className={overlayStyles.overlay} role="dialog" aria-modal="true" aria-label="Demo 控制台" onClick={onClose}>
      <motion.aside
        className={`${overlayStyles.modal} ${styles.panel}`}
        initial={{ opacity: 0, scale: .94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .94, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={overlayStyles.close} aria-label="关闭" onClick={onClose}><X size={20} /></button>

        <header className={overlayStyles.modalHeading}>
          <span>Demo 控制台</span>
          <small>稳定展示任意状态</small>
        </header>

        <div className={styles.section}>
          <label>树木风格</label>
          <div className={styles.themeSwitch}>
            <button className={treeTheme === 'candy' ? styles.active : ''} onClick={() => setTreeTheme('candy')}>黏土糖果树</button>
            <button className={treeTheme === 'pixel' ? styles.active : ''} onClick={() => setTreeTheme('pixel')}>原像素树</button>
          </div>
        </div>

        <div className={styles.section}>
          <label>树阶段</label>
          <div className={styles.stageGrid} style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
            {stages.map((stage) => (
              <button className={treeStage === stage.stage ? styles.active : ''} key={stage.stage} onClick={() => setStage(stage.stage as TreeStage)}>
                {stage.stage}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => addGrowth(15)}><FastForward size={15} />加 15 秒</button>
          <button onClick={() => simulateShare()}><Gift size={15} />随机奖励</button>
          <button className={styles.danger} onClick={reset}><RotateCcw size={15} />重置</button>
        </div>

        <div className={styles.section}>
          <label>指定掉落</label>
          <div className={styles.dolls}>
            {dolls.map((doll) => (
              <button key={doll.id} onClick={() => simulateShare(doll.id as DollId)}>
                <img src={doll.asset} alt="" /><span>{doll.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className={styles.collapse} onClick={onClose}><ChevronDown size={14} />收起</button>
      </motion.aside>
    </div>
  );
}
