import type { DollConfig, StageConfig } from '../types/demo';
import { assetUrl } from '../lib/assetUrl';

export const song = {
  title: '尽情一刻',
  artist: '汪苏泷',
  audioM4a: assetUrl('assets/audio/demo.m4a'),
  audioOgg: assetUrl('assets/audio/demo.ogg'),
};

const getTreeAnimationFrames = (stage: number) =>
  Array.from(
    { length: 8 },
    (_, index) => assetUrl(`assets/trees/sway/stage-${stage}/frame-${String(index + 1).padStart(2, '0')}.webp?v=2`),
  );

export const pixelStages: StageConfig[] = [
  { stage: 1, name: '初遇之芽', minSeconds: 0, message: '开始自习，种子正在悄悄发芽。', asset: assetUrl('assets/trees/stage-1.webp'), animationFrames: getTreeAnimationFrames(1), albumPresentation: { scale: .3, offsetY: 0 } },
  { stage: 2, name: '心动花枝', minSeconds: 180, message: '专注 3 分钟，花枝已悄然绽放。', asset: assetUrl('assets/trees/stage-2.webp'), animationFrames: getTreeAnimationFrames(2), albumPresentation: { scale: .45, offsetY: 0 } },
  { stage: 3, name: '罗曼音树', minSeconds: 480, message: '坚持 8 分钟，旋律在心中成形。', asset: assetUrl('assets/trees/stage-3.webp'), animationFrames: getTreeAnimationFrames(3), albumPresentation: { scale: .68, offsetY: 0 } },
  { stage: 4, name: '星光乐树', minSeconds: 1080, message: '18 分钟的专注，星光为你点亮。', asset: assetUrl('assets/trees/stage-4.webp'), animationFrames: getTreeAnimationFrames(4), albumPresentation: { scale: .88, offsetY: 0 } },
  { stage: 5, name: '罗曼音乐树', minSeconds: 1800, message: '半小时的沉浸，已是一片森林。', asset: assetUrl('assets/trees/stage-5.webp'), animationFrames: getTreeAnimationFrames(5), albumPresentation: { scale: .98, offsetY: 0 } },
];

export const candyStages: StageConfig[] = [
  { stage: 1, name: '糖果初芽', minSeconds: 0, message: '音乐响起，第一颗糖果嫩芽正在生长。', asset: assetUrl('assets/trees/candy-clay/stage-1.webp'), renderMode: 'smooth', albumPresentation: { scale: .94, offsetY: 30 } },
  { stage: 2, name: '粉云幼树', minSeconds: 180, message: '专注 3 分钟，粉色云朵树冠已经展开。', asset: assetUrl('assets/trees/candy-clay/stage-2.webp'), renderMode: 'smooth', albumPresentation: { scale: .94, offsetY: 30 } },
  { stage: 3, name: '音乐糖果树', minSeconds: 480, message: '坚持 8 分钟，旋律与糖果挂满枝头。', asset: assetUrl('assets/trees/candy-clay/stage-3.webp'), renderMode: 'smooth', albumPresentation: { scale: .94, offsetY: 30 } },
  { stage: 4, name: '糖果盛放', minSeconds: 1080, message: '18 分钟的陪伴，让糖果音乐树完整盛放。', asset: assetUrl('assets/trees/candy-clay/stage-4.webp'), renderMode: 'smooth', albumPresentation: { scale: .94, offsetY: 30 } },
];

// 保留旧导出，避免其他森林展示模块丢失原像素树方案。
export const stages = pixelStages;

export const dolls: DollConfig[] = [
  { id: 'futa', name: '福塔', description: '福塔来帮你守护这棵小树啦。', asset: assetUrl('assets/dolls/futa-front.webp'), color: '#ff7eb3' },
  { id: 'happy-teeth', name: '嗨皮牙', description: '嗨皮牙听到音乐就忍不住大笑。', asset: assetUrl('assets/dolls/happy-teeth-front.webp'), color: '#f25ca4' },
  { id: 'shalala', name: '鲨啦啦', description: '鲨啦啦正在跟着旋律摇摆。', asset: assetUrl('assets/dolls/shalala-front.webp'), color: '#26d4d0' },
  { id: 'green', name: '咘焦绿', description: '咘焦绿为森林充满音乐能量。', asset: assetUrl('assets/dolls/green-front.webp'), color: '#68d95b' },
  { id: 'sulong', name: '素龙', description: '素龙入住了你的罗曼音乐树。', asset: assetUrl('assets/dolls/sulong-front.webp'), color: '#f58aad' },
];
