import { Share2, SlidersHorizontal } from "lucide-react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDemo } from "../context/DemoContext";
import { formatTime, getStageConfig } from "../lib/demoLogic";
import { assetUrl } from "../lib/assetUrl";
import { Album3DView } from "./Album3DView";
import { NativePlayerPanel } from "./NativePlayerPanel";
import { StageUpgradeModal } from "./StageUpgradeModal";
import { ShareCardModal } from "./ShareCardModal";
import { DollRewardModal } from "./DollRewardModal";
import { ResidentGallery } from "./ResidentGallery";
import { DemoPanel } from "./DemoPanel";
import { StudyExitModal } from "./StudyExitModal";
import { StudyStartModal } from "./StudyStartModal";
import { StudyGrowthProgress } from "./StudyGrowthProgress";
import styles from "./PlayerPage.module.css";

export function PlayerPage() {
  const { setShareOpen, upgradeStage, rewardModalOpen, shareModalOpen, playedSeconds, isStudying, treeStage, treeTheme, startStudying, stopStudying, setPlaying } =
    useDemo();
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<0 | 1>(0);
  const [albumForestRevealed, setAlbumForestRevealed] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [revertToFlatVersion, setRevertToFlatVersion] = useState(0);
  const [resetToDefaultVersion, setResetToDefaultVersion] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const currentStage = getStageConfig(treeStage, treeTheme);

  const containerRef = useRef<HTMLDivElement>(null);
  const swipeX = useMotionValue(0);
  const isDragging = useRef(false);

  const getViewportWidth = useCallback(() => containerRef.current?.clientWidth ?? 375, []);

  useEffect(() => {
    const width = getViewportWidth();
    animate(swipeX, -currentStyle * width, { type: "spring", stiffness: 330, damping: 32 });
  }, [currentStyle, swipeX, getViewportWidth]);

  useEffect(() => {
    const toggleDemoPanel = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === "d") setPanelOpen((open) => !open);
    };
    window.addEventListener("keydown", toggleDemoPanel);
    return () => window.removeEventListener("keydown", toggleDemoPanel);
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false;
      const width = getViewportWidth();
      const threshold = width * 0.25;
      if (currentStyle === 0 && (info.offset.x < -threshold || info.velocity.x < -500)) setCurrentStyle(1);
      else if (currentStyle === 1 && (info.offset.x > threshold || info.velocity.x > 500)) setCurrentStyle(0);
    },
    [currentStyle, getViewportWidth],
  );

  const switchToStyle = useCallback((style: 0 | 1) => setCurrentStyle(style), []);

  // 唱片放平后，先请求用户确认是否开启自习。
  const handleForestReveal = useCallback(() => {
    setStartModalOpen(true);
  }, []);

  const handleConfirmStart = useCallback(() => {
    setStartModalOpen(false);
    setAlbumForestRevealed(true);
    startStudying();
    setPlaying(true);
  }, [setPlaying, startStudying]);

  const handleCancelStart = useCallback(() => {
    setStartModalOpen(false);
    setResetToDefaultVersion((value) => value + 1);
  }, []);

  // 翻回专辑 → 退出确认弹窗
  const handleFlipBack = useCallback(() => setExitModalOpen(true), []);

  // 继续自习
  const handleContinueStudy = useCallback(() => {
    setExitModalOpen(false);
    setRevertToFlatVersion((v) => v + 1);
  }, []);

  // 退出自习
  const handleExitStudy = useCallback(() => {
    setExitModalOpen(false);
    setAlbumForestRevealed(false);
    setResetToDefaultVersion((value) => value + 1);
    stopStudying();
    setPlaying(false);
  }, [setPlaying, stopStudying]);

  // 分享成果（保持自习状态，打开分享卡）
  const handleShareFromExit = useCallback(() => {
    setExitModalOpen(false);
    setShareOpen(true);
  }, [setShareOpen]);

  return (
    <main className={styles.viewport}>
      <section className={`${styles.phoneShell} ${currentStyle === 0 ? styles.styleOneShell : styles.styleTwoShell} ${currentStyle === 1 && albumForestRevealed ? styles.immersiveShell : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerSpacer} />
          <div className={styles.pager} aria-label="播放页样式切换">
            <button className={`${styles.pagerDot} ${currentStyle === 0 ? styles.activeDot : ""}`} onClick={() => switchToStyle(0)} aria-label="标准播放样式" />
            <button className={`${styles.pagerDot} ${currentStyle === 1 ? styles.activeDot : ""}`} onClick={() => switchToStyle(1)} aria-label="3D专辑旋转样式" />
          </div>
          <div className={styles.headerActions}>
            <button className={`${styles.headerButton} ${styles.debugButton}`} aria-label="打开 Demo 控制台" onClick={() => setPanelOpen(true)}>
              <SlidersHorizontal size={16} />
              <span>调试</span>
            </button>
            <button className={styles.headerButton} aria-label="打开分享" onClick={() => setShareOpen(true)}><Share2 size={23} /></button>
          </div>
        </header>

        <section className={styles.forestArea} ref={containerRef}>
          <motion.div
            className={styles.swipeTrack}
            style={{ x: swipeX }}
            drag="x"
            dragConstraints={{ left: -getViewportWidth(), right: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={handleDragEnd}
          >
            <div className={`${styles.stylePage} ${styles.styleOnePage}`}>
              <motion.div className={styles.displayLayer} initial={{ opacity: 0, scale: 1.018 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.48, ease: "easeOut" }}>
                <img className={styles.albumCover} src={assetUrl('assets/covers/speak-now.jpg')} alt="Taylor Swift《Speak Now》专辑封面" />
              </motion.div>
            </div>
            <div className={styles.stylePage}>
              <Album3DView
                forestRevealed={albumForestRevealed}
                revertToFlatVersion={revertToFlatVersion}
                resetToDefaultVersion={resetToDefaultVersion}
                onForestReveal={handleForestReveal}
                onFlipBack={handleFlipBack}
              />
              {isStudying && albumForestRevealed && (
                <button className={styles.studyOverlay} onClick={handleFlipBack}>
                  <img src={currentStage.asset} alt="" />
                  <span>已自习</span>
                  <strong>{formatTime(playedSeconds)}</strong>
                </button>
              )}
            </div>
          </motion.div>
        </section>

        {currentStyle === 1 && albumForestRevealed && isStudying && (
          <StudyGrowthProgress treeStage={treeStage} playedSeconds={playedSeconds} />
        )}

        <NativePlayerPanel tone="light" />

        <DemoPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        {upgradeStage && <StageUpgradeModal />}
        {shareModalOpen && <ShareCardModal />}
        {rewardModalOpen && <DollRewardModal onEnterForest={() => setGalleryOpen(true)} />}
        {galleryOpen && <ResidentGallery onClose={() => setGalleryOpen(false)} />}
        {startModalOpen && <StudyStartModal onConfirm={handleConfirmStart} onCancel={handleCancelStart} />}
        {exitModalOpen && (
          <StudyExitModal
            treeStage={treeStage}
            studySeconds={playedSeconds}
            onContinue={handleContinueStudy}
            onExit={handleExitStudy}
            onShare={handleShareFromExit}
          />
        )}
      </section>
    </main>
  );
}
