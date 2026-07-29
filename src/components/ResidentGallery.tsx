import { motion } from 'framer-motion';
import { UserRoundSearch, Users, X } from 'lucide-react';
import { dolls } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import styles from './Overlay.module.css';

const TOTAL_RESIDENTS = 6;

interface ResidentGalleryProps {
  onClose(): void;
}

export function ResidentGallery({ onClose }: ResidentGalleryProps) {
  const { collectedDolls } = useDemo();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="森林居民图鉴" onClick={onClose}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: .94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .94, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} aria-label="关闭" onClick={onClose}><X size={20} /></button>

        <header className={styles.modalHeading}>
          <span><Users size={16} /> 音乐森林居民</span>
          <small>{collectedDolls.length} / {TOTAL_RESIDENTS} 位居民已入住</small>
        </header>

        <div className={styles.galleryGrid}>
          {dolls.map((doll) => {
            const owned = collectedDolls.includes(doll.id);
            return (
              <div key={doll.id} className={`${styles.galleryItem} ${owned ? styles.owned : styles.locked}`}>
                <div className={styles.galleryAvatar} style={{ '--halo': doll.color } as React.CSSProperties}>
                  {owned ? (
                    <img src={doll.asset} alt={doll.name} />
                  ) : (
                    <UserRoundSearch size={28} className={styles.galleryUnknown} />
                  )}
                </div>
                <strong>{owned ? doll.name : '???'}</strong>
                <small>{owned ? doll.description : '分享后解锁'}</small>
              </div>
            );
          })}

          {Array.from({ length: TOTAL_RESIDENTS - dolls.length }).map((_, index) => (
            <div key={`mystery-${index}`} className={`${styles.galleryItem} ${styles.locked}`}>
              <div className={styles.galleryAvatar}>
                <UserRoundSearch size={28} className={styles.galleryUnknown} />
              </div>
              <strong>???</strong>
              <small>待发现</small>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
