import { LockKeyhole, Users } from 'lucide-react';
import { dolls } from '../data/demoData';
import { useDemo } from '../context/DemoContext';
import styles from './CollectionBar.module.css';

export function CollectionBar() {
  const { collectedDolls } = useDemo();
  return (
    <section className={styles.collection}>
      <div className={styles.title}><span><Users size={14} /> 森林居民</span><small>{collectedDolls.length}/5</small></div>
      <div className={styles.list}>
        {dolls.map((doll) => {
          const owned = collectedDolls.includes(doll.id);
          return (
            <div className={`${styles.item} ${owned ? styles.owned : ''}`} key={doll.id} title={owned ? doll.name : '分享后解锁'}>
              {owned ? <img src={doll.asset} alt={doll.name} /> : <LockKeyhole size={15} />}
              <span>{owned ? doll.name : '待入住'}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
