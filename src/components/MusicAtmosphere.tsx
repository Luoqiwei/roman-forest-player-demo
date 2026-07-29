import { motion } from 'framer-motion';
import styles from './MusicAtmosphere.module.css';

interface MusicAtmosphereProps {
  visible: boolean;
  active: boolean;
}

const waveform = Array.from({ length: 46 }, (_, index) =>
  12 + ((index * 17 + index * index * 3) % 42),
);

const backRibbonPaths = [
  'M-38 192 C 58 120, 112 242, 202 174 S 340 126, 438 214',
  'M-38 166 C 58 224, 112 116, 202 194 S 340 236, 438 170',
  'M-38 204 C 58 144, 112 228, 202 164 S 340 140, 438 224',
];

const frontRibbonPaths = [
  'M-44 260 C 54 196, 126 296, 218 224 S 344 186, 442 250',
  'M-44 232 C 54 292, 126 188, 218 252 S 344 294, 442 220',
  'M-44 272 C 54 214, 126 284, 218 214 S 344 202, 442 264',
];

export function MusicAtmosphere({ visible, active }: MusicAtmosphereProps) {
  return (
    <div
      className={`${styles.atmosphere} ${visible ? styles.visible : ''} ${active ? styles.active : ''}`}
      aria-hidden="true"
    >
      <div className={styles.glow} />
      <svg className={styles.ribbons} viewBox="0 0 390 464" preserveAspectRatio="none">
        <motion.path
          className={styles.ribbonBack}
          initial={false}
          animate={{ d: active ? backRibbonPaths : backRibbonPaths[0] }}
          transition={active ? { duration: 7.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: .4 }}
        />
        <path className={styles.ribbonBackFlow} d="M-38 192 C 58 120, 112 242, 202 174 S 340 126, 438 214" />
        <motion.path
          className={styles.ribbonFront}
          initial={false}
          animate={{ d: active ? frontRibbonPaths : frontRibbonPaths[0] }}
          transition={active ? { duration: 5.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: .4 }}
        />
        <path className={styles.ribbonFrontFlow} d="M-44 260 C 54 196, 126 296, 218 224 S 344 186, 442 250" />
        <g className={styles.waveform}>
          {waveform.map((height, index) => (
            <rect
              className={styles.bar}
              key={index}
              x={index * 8.5}
              y={230 - height / 2}
              width="2.4"
              height={height}
              rx="1.2"
              style={{ animationDelay: `${index * -0.055}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
