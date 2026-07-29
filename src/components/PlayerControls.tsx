import { ListMusic, Pause, Play, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { song } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import { formatTime } from '../lib/demoLogic';
import styles from './PlayerControls.module.css';

export function PlayerControls() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, currentTime, duration, resetVersion, setPlaying, setAudioTime } = useDemo();
  const [audioAvailable, setAudioAvailable] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioAvailable) return;
    if (isPlaying) {
      audio.play().catch(() => setAudioAvailable(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, audioAvailable]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, [resetVersion]);

  const toggle = () => setPlaying(!isPlaying);
  const seek = (value: number) => {
    const audio = audioRef.current;
    if (audio && audioAvailable) audio.currentTime = value;
    setAudioTime(value, duration);
  };

  return (
    <section className={styles.controls}>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(event) => setAudioTime(event.currentTarget.currentTime, event.currentTarget.duration)}
        onLoadedMetadata={(event) => setAudioTime(0, event.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onError={() => setAudioAvailable(false)}
      >
        <source src={song.audioM4a} type="audio/mp4" />
        <source src={song.audioOgg} type="audio/ogg" />
      </audio>

      <div className={styles.timeline}>
        <input aria-label="播放进度" type="range" min="0" max={duration || 198} step="0.1" value={Math.min(currentTime, duration)} onChange={(event) => seek(Number(event.target.value))} />
        <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>

      <div className={styles.actions}>
        <button aria-label="随机播放"><Shuffle size={25} /></button>
        <button aria-label="上一首" onClick={() => seek(Math.max(0, currentTime - 10))}><SkipBack size={24} fill="currentColor" /></button>
        <button className={styles.play} aria-label={isPlaying ? '暂停' : '播放'} onClick={toggle}>
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={29} fill="currentColor" />}
        </button>
        <button aria-label="下一首" onClick={() => seek(Math.min(duration, currentTime + 10))}><SkipForward size={24} fill="currentColor" /></button>
        <button aria-label="播放列表"><ListMusic size={25} /></button>
      </div>

      {!audioAvailable && <p className={styles.fallback}>音频无法加载，已切换为演示计时模式</p>}
    </section>
  );
}
