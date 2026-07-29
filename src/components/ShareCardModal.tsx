import { toPng } from 'html-to-image';
import { Download, Share2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { formatTime, getStageConfig } from '../lib/demoLogic';
import styles from './Overlay.module.css';

export function ShareCardModal() {
  const { treeStage, treeTheme, playedSeconds, setShareOpen, simulateShare } = useDemo();
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const stage = getStageConfig(treeStage, treeTheme);

  const download = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#fff8fa' });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `罗曼森林-${stage.name}.png`;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="分享我的森林">
      <div className={styles.modal}>
        <button className={styles.close} aria-label="关闭" onClick={() => setShareOpen(false)}><X size={20} /></button>
        <div className={styles.modalHeading}><span>分享我的森林</span><small>把陪伴长成一张可以收藏的卡片</small></div>
        <div className={styles.shareCard} ref={cardRef}>
          <div className={styles.shareVisual}>
            <div className={styles.shareTreeGlow} />
            <div className={styles.shareTreeShadow} />
            <img
              className={`${styles.shareTree} ${stage.renderMode === 'pixelated' ? styles.shareTreePixel : styles.shareTreeSmooth}`}
              src={stage.asset}
              alt={stage.name}
            />
            <span className={styles.shareStageBadge}>第 {stage.stage} 阶段 · {stage.name}</span>
          </div>
          <div className={styles.shareCopy}>
            <span>ROMAN FOREST · 第 {stage.stage} 阶段</span>
            <h2>我和他的音乐，<br />已经长成「{stage.name}」</h2>
            <p>今天又专注了一段时间，陪伴感正在慢慢生长</p>
            <div className={styles.shareStats}>
              <div><small>陪伴时长</small><strong>{formatTime(playedSeconds)}</strong></div>
              <div><small>正在听</small><strong>《尽情一刻》</strong></div>
            </div>
            <div className={styles.residentTag}>
              <span className={styles.mysteryResident} aria-hidden="true"><b>?</b></span>
              <span>分享后有几率获得隐藏森林居民</span>
            </div>
            <footer><strong>罗曼森林</strong><span>和我一起听歌种树 ♪</span></footer>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.secondary} onClick={download} disabled={exporting}><Download size={17} />{exporting ? '生成中…' : '下载 PNG'}</button>
          <button className={styles.primary} onClick={() => simulateShare()}><Share2 size={17} />模拟分享成功</button>
        </div>
      </div>
    </div>
  );
}
