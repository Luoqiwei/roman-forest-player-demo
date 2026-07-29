import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type CSSProperties } from 'react';
import type { StageConfig } from '../types/demo';
import styles from './AlbumTree.module.css';

const EMPTY_ANIMATION_FRAMES: string[] = [];

interface AlbumTreeProps {
  stage: StageConfig;
  isPlaying: boolean;
}

type TreePlacementStyle = CSSProperties & {
  '--album-tree-scale': number;
  '--album-tree-offset-x': string;
  '--album-tree-offset-y': string;
};

export function AlbumTree({ stage, isPlaying }: AlbumTreeProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const presentation = stage.albumPresentation;
  const animationFrames = stage.animationFrames ?? EMPTY_ANIMATION_FRAMES;
  const treeAsset = isPlaying && animationFrames.length > 0
    ? animationFrames[frameIndex % animationFrames.length]
    : stage.asset;
  const placementStyle: TreePlacementStyle = {
    '--album-tree-scale': presentation?.scale ?? 1,
    '--album-tree-offset-x': `${presentation?.offsetX ?? 0}px`,
    '--album-tree-offset-y': `${presentation?.offsetY ?? 0}px`,
  };
  const isSmoothTree = stage.renderMode === 'smooth';

  useEffect(() => {
    setFrameIndex(0);
    if (!isPlaying || animationFrames.length < 2) return;

    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % animationFrames.length);
    }, 180);

    return () => window.clearInterval(timer);
  }, [animationFrames, isPlaying, stage.stage]);

  useEffect(() => {
    animationFrames.forEach((asset) => {
      const image = new Image();
      image.src = asset;
    });
  }, [animationFrames]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${stage.asset}-${stage.stage}`}
        className={`${styles.root} ${isSmoothTree ? styles.clayRoot : ''} ${isSmoothTree && isPlaying ? styles.clayPlaying : ''}`}
        role="img"
        aria-label={`专辑上的${stage.name}`}
        initial={{ opacity: 0, scale: .18, y: 54 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.08, y: -12 }}
        transition={{ type: 'spring', stiffness: 130, damping: 15 }}
      >
        <div className={styles.placement} style={placementStyle}>
          <img
            className={`${styles.tree} ${isSmoothTree ? styles.smoothTree : ''} ${isSmoothTree && isPlaying ? styles.smoothTreePlaying : ''}`}
            src={treeAsset}
            alt=""
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
