import { PAGE_META } from '../context/NavigationContext';
import styles from './PlaceholderPage.module.css';

function PlaceholderPage({ pageId }) {
  const meta = PAGE_META[pageId] || PAGE_META.home;

  return (
    <div className={styles.placeholder}>
      <span className={styles.badge}>Скоро</span>
      <h2 className={styles.title}>{meta.title}</h2>
      <p className={styles.text}>Раздел в разработке. Контент появится в следующих версиях.</p>
    </div>
  );
}

export default PlaceholderPage;
