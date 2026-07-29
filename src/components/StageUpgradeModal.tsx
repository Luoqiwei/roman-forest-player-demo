import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { getStageConfig } from '../lib/demoLogic';
import styles from './Overlay.module.css';

export function StageUpgradeModal() {
  const { upgradeStage, dismissUpgrade, treeTheme } = useDemo();
  if (!upgradeStage) return null;
  const stage = getStageConfig(upgradeStage, treeTheme);
  return (
    <div className={styles.overlay} aria-live="polite" onClick={dismissUpgrade} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Escape' && dismissUpgrade()}>
      <motion.div className={styles.upgrade} initial={{ opacity: 0, scale: .65, y: 35 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}>
        <Sparkles className={styles.sparkle} size={30} />
        <span>成长到第 {upgradeStage} 阶段</span>
        <h2>{stage.name}</h2>
        <p>{stage.message}</p>
        <small>点击任意位置跳过</small>
      </motion.div>
    </div>
  );
}
