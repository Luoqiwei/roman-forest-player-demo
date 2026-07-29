import { motion } from 'framer-motion';
import { Home, Sparkles, X } from 'lucide-react';
import { dolls } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import styles from './Overlay.module.css';

interface DollRewardModalProps {
  onEnterForest(): void;
}

export function DollRewardModal({ onEnterForest }: DollRewardModalProps) {
  const { selectedRewardId, closeReward } = useDemo();
  const doll = dolls.find((item) => item.id === selectedRewardId);
  if (!doll) return null;

  const handleEnter = () => {
    closeReward();
    onEnterForest();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="获得森林居民">
      <motion.div className={styles.reward} initial={{ opacity: 0, y: -100, rotate: -7, scale: .7 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 210, damping: 14 }}>
        <button className={styles.close} aria-label="关闭" onClick={closeReward}><X size={20} /></button>
        <Sparkles className={styles.rewardSparkle} size={25} />
        <span>发现新居民</span>
        <div className={styles.dollHalo} style={{ '--halo': doll.color } as React.CSSProperties}><img src={doll.asset} alt={doll.name} /></div>
        <h2>{doll.name}</h2>
        <p>{doll.description}</p>
        <button className={styles.primary} onClick={handleEnter}><Home size={17} />欢迎入住音乐森林</button>
      </motion.div>
    </div>
  );
}
