import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { ChevronUp, Trees } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { getStageConfig } from '../lib/demoLogic';
import { assetUrl } from '../lib/assetUrl';
import { AlbumTree } from './AlbumTree';
import { MusicAtmosphere } from './MusicAtmosphere';
import styles from './Album3DView.module.css';

interface Album3DViewProps {
  forestRevealed: boolean;
  revertToFlatVersion: number;
  resetToDefaultVersion: number;
  onForestReveal(): void;
  onFlipBack(): void;
}

const DEFAULT_ROTATION = 0;
const REVEALED_ROTATION = 68;
const FLAT_THRESHOLD = 60;
const FLIP_BACK_THRESHOLD = 20;
const SWIPE_REVEAL_DISTANCE = 72;
const SENSITIVITY = 0.35;
const SETTLE_DURATION_SECONDS = .42;
const SETTLE_FALLBACK_MS = 500;

export function Album3DView({ forestRevealed, revertToFlatVersion, resetToDefaultVersion, onForestReveal, onFlipBack }: Album3DViewProps) {
  const { isPlaying, treeStage, treeTheme } = useDemo();
  const stage = getStageConfig(treeStage, treeTheme);
  const rotX = useMotionValue(DEFAULT_ROTATION);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartRot = useRef(DEFAULT_ROTATION);
  const dragDistanceY = useRef(0);
  const isSettlingRef = useRef(false);
  const rotationAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const rotationCompletionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRotationAnimation = useCallback(() => {
    const controls = rotationAnimationRef.current;
    rotationAnimationRef.current = null;
    if (rotationCompletionTimerRef.current) clearTimeout(rotationCompletionTimerRef.current);
    rotationCompletionTimerRef.current = null;
    controls?.stop();
  }, []);

  const settleRotation = useCallback((target: number, onComplete?: () => void) => {
    stopRotationAnimation();
    const locksInteraction = Boolean(onComplete);
    isSettlingRef.current = locksInteraction;
    setIsSettling(locksInteraction);

    const controls = animate(rotX, target, {
      type: 'tween',
      duration: SETTLE_DURATION_SECONDS,
      ease: [0.22, 1, 0.36, 1],
    });
    rotationAnimationRef.current = controls;

    const finish = () => {
      if (rotationAnimationRef.current !== controls) return;
      rotationAnimationRef.current = null;
      if (rotationCompletionTimerRef.current) {
        clearTimeout(rotationCompletionTimerRef.current);
        rotationCompletionTimerRef.current = null;
      }
      isSettlingRef.current = false;
      setIsSettling(false);
      onComplete?.();
    };

    controls.then(finish);
    // 测试环境或低帧率设备可能暂停动画帧，兜底保证交互流程不会卡住。
    rotationCompletionTimerRef.current = setTimeout(finish, SETTLE_FALLBACK_MS);
  }, [rotX, stopRotationAnimation]);

  useEffect(() => () => {
    stopRotationAnimation();
  }, [stopRotationAnimation]);

  // --- 放平专辑（开启自习） ---
  const startRevealGesture = useCallback((clientY: number) => {
    if (forestRevealed || isSettlingRef.current) return;
    stopRotationAnimation();
    dragStartY.current = clientY;
    dragStartRot.current = rotX.get();
    dragDistanceY.current = 0;
    isDraggingRef.current = true;
    setIsDragging(true);
    setHintVisible(false);
  }, [forestRevealed, rotX, stopRotationAnimation]);

  const moveRevealGesture = useCallback((clientY: number) => {
    if (forestRevealed || !isDraggingRef.current) return;
    const deltaY = clientY - dragStartY.current;
    dragDistanceY.current = deltaY;
    const newRot = dragStartRot.current - deltaY * SENSITIVITY;
    rotX.set(Math.min(70, Math.max(-10, newRot)));
  }, [forestRevealed, rotX]);

  const endRevealGesture = useCallback(() => {
    if (forestRevealed || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const currentRot = rotX.get();
    const hasUpwardSwipe = dragDistanceY.current <= -SWIPE_REVEAL_DISTANCE;
    if (currentRot >= FLAT_THRESHOLD || hasUpwardSwipe) {
      settleRotation(REVEALED_ROTATION, onForestReveal);
    } else {
      settleRotation(DEFAULT_ROTATION);
    }
    dragDistanceY.current = 0;
  }, [forestRevealed, rotX, onForestReveal, settleRotation]);

  // --- 翻回专辑（触发退出确认） ---
  const startFlipBack = useCallback((clientY: number) => {
    if (!forestRevealed || isSettlingRef.current) return;
    stopRotationAnimation();
    dragStartY.current = clientY;
    dragStartRot.current = rotX.get();
    dragDistanceY.current = 0;
    isDraggingRef.current = true;
    setIsDragging(true);
  }, [forestRevealed, rotX, stopRotationAnimation]);

  const moveFlipBack = useCallback((clientY: number) => {
    if (!forestRevealed || !isDraggingRef.current) return;
    const deltaY = clientY - dragStartY.current;
    dragDistanceY.current = deltaY;
    const newRot = dragStartRot.current - deltaY * SENSITIVITY;
    rotX.set(Math.min(REVEALED_ROTATION, Math.max(-10, newRot)));
  }, [forestRevealed, rotX]);

  const endFlipBack = useCallback(() => {
    if (!forestRevealed || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (rotX.get() <= FLIP_BACK_THRESHOLD) {
      onFlipBack();
    } else {
      settleRotation(REVEALED_ROTATION);
    }
    dragDistanceY.current = 0;
  }, [forestRevealed, rotX, onFlipBack, settleRotation]);

  // --- 触摸事件 ---
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (forestRevealed) startFlipBack(e.touches[0].clientY); else startRevealGesture(e.touches[0].clientY);
  }, [forestRevealed, startFlipBack, startRevealGesture]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (forestRevealed) moveFlipBack(e.touches[0].clientY); else moveRevealGesture(e.touches[0].clientY);
  }, [forestRevealed, moveFlipBack, moveRevealGesture]);

  const onTouchEnd = useCallback(() => {
    if (forestRevealed) endFlipBack(); else endRevealGesture();
  }, [forestRevealed, endFlipBack, endRevealGesture]);

  // --- 鼠标事件 ---
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (forestRevealed) startFlipBack(e.clientY); else startRevealGesture(e.clientY);
  }, [forestRevealed, startFlipBack, startRevealGesture]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (forestRevealed) moveFlipBack(e.clientY); else moveRevealGesture(e.clientY);
  }, [forestRevealed, moveFlipBack, moveRevealGesture]);

  const onMouseUp = useCallback(() => {
    if (forestRevealed) endFlipBack(); else endRevealGesture();
  }, [forestRevealed, endFlipBack, endRevealGesture]);

  // 继续自习时动画回到平躺
  useEffect(() => {
    if (!forestRevealed) return;
    settleRotation(REVEALED_ROTATION);
  }, [revertToFlatVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // 取消开启自习时，唱片回到初始展示角度。
  useEffect(() => {
    if (forestRevealed || resetToDefaultVersion === 0) return;
    setHintVisible(true);
    settleRotation(DEFAULT_ROTATION);
  }, [resetToDefaultVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.scene3D}>
      <MusicAtmosphere visible={forestRevealed} active={isPlaying} />

      <AnimatePresence>
        {forestRevealed && (
          <motion.div
            className={styles.visualCard}
            initial={{ opacity: 0, scale: .94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .96, y: 12 }}
            transition={{ duration: .42, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <div className={styles.albumWrapper}>
        <div className={`${styles.albumAnchor} ${forestRevealed ? styles.revealedAnchor : ''}`}>
          <motion.div
            className={`${styles.albumCard} ${isDragging ? styles.dragging : ''} ${isSettling ? styles.settlingCard : ''} ${forestRevealed ? styles.revealedCard : ''}`}
            style={{ rotateX: rotX }}
            animate={{
              scaleX: forestRevealed ? 1.035 : 1,
              scaleY: forestRevealed ? 1.04 : 1,
            }}
            transition={{ duration: SETTLE_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div className={`${styles.cardFace} ${styles.frontFace} ${isPlaying ? styles.spinning : ''}`}>
              <img data-testid="rotating-album-cover" src={assetUrl('assets/covers/speak-now.jpg')} alt="Taylor Swift《Speak Now》专辑封面" />
            </div>
            <div className={styles.discEdge} />
            <div className={`${styles.cardFace} ${styles.backFace}`}>
              <div className={styles.backContent}><Trees size={42} /><span>罗曼森林</span></div>
            </div>
          </motion.div>
        </div>

        {forestRevealed && <AlbumTree stage={stage} isPlaying={isPlaying} />}

        <AnimatePresence>
          {!forestRevealed && hintVisible && (
            <motion.div className={styles.hint} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: .15 } }} transition={{ delay: .8 }}>
              <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><ChevronUp size={18} /></motion.span>
              <small>向上滑动放平专辑</small>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* {forestRevealed && (
            <motion.div className={styles.hint} style={{ bottom: 200 }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: .6 }}>
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><ChevronDown size={18} /></motion.span>
              <small>向下滑动翻回专辑</small>
            </motion.div>
          )} */}
        </AnimatePresence>
      </div>
    </section>
  );
}
