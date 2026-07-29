import { Share2, Trees, X } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { CollectionBar } from './CollectionBar';
import { GrowthProgress } from './GrowthProgress';
import styles from './ForestDetailModal.module.css';

export function ForestDetailModal({ onClose }: { onClose(): void }) {
  const { setShareOpen } = useDemo();

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="罗曼森林详情">
      <section className={styles.sheet}>
        <div className={styles.handle} />
        <header>
          <div><Trees size={20} /><span><strong>罗曼森林</strong><small>查看音乐树的成长与居民</small></span></div>
          <button aria-label="关闭森林详情" onClick={onClose}><X size={20} /></button>
        </header>
        <GrowthProgress />
        <CollectionBar />
        <button className={styles.share} onClick={() => setShareOpen(true)}><Share2 size={17} />分享森林</button>
      </section>
    </div>
  );
}
