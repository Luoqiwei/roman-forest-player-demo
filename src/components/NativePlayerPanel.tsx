import { Bell, Download, Gem, Heart, MessageCircle, MessageSquare, MoreVertical } from 'lucide-react';
import { song } from '../data/demoData';
import { PlayerControls } from './PlayerControls';
import styles from './NativePlayerPanel.module.css';

const featureTabs = ['关注', '原唱', '限免', '标准', '音效', '伴唱', '视频'];

export function NativePlayerPanel({ tone, variant = 'full' }: { tone: 'light' | 'dark'; variant?: 'full' | 'compact' }) {
  return (
    <section className={`${styles.panel} ${tone === 'light' ? styles.lightPanel : styles.darkPanel} ${variant === 'compact' ? styles.compactPanel : ''}`} aria-label="原生播放器区域">
      <div className={styles.songInfo}>
        <h2>{song.title}</h2>
        <div className={styles.artistLine}>
          <span>{song.artist}{variant === 'compact' ? ` · ${song.title}` : ''}</span>
          {variant === 'full' && (
            <div className={styles.featureTabs}>
              {featureTabs.map((tab) => <button key={tab}>{tab}</button>)}
            </div>
          )}
        </div>
      </div>

      <nav className={styles.reactions} aria-label="歌曲操作">
        <button aria-label="歌曲评论"><MessageCircle /><span /></button>
        <button aria-label="VIP 下载"><Download /><small>VIP</small></button>
        <button aria-label="设置铃声"><Bell /><span /></button>
        <button aria-label="收藏歌曲"><Heart /><em>22w</em></button>
        <button aria-label="查看评论"><MessageSquare /><em>2k</em></button>
        <button aria-label="更多歌曲操作"><MoreVertical /><span /></button>
      </nav>

      <PlayerControls />

      <button className={styles.vipBanner} aria-label="开通会员无限畅享">
        <Gem size={19} fill="currentColor" />
        <span>会员歌曲限时免费试听</span>
        <strong>开会员无限畅享 ›</strong>
      </button>
    </section>
  );
}
