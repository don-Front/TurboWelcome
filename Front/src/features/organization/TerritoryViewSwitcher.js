import styles from './GalleryViewSwitcher.module.css';
import { TERRITORY_VIEW_MODES } from './territoryData';

function TerritoryViewSwitcher({ value, onChange }) {
  return (
    <div className={styles.switcher} role="radiogroup" aria-label="Вариант отображения схем территорий">
      {TERRITORY_VIEW_MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          role="radio"
          aria-checked={value === mode.id}
          className={`${styles.option} ${value === mode.id ? styles.optionActive : ''}`}
          onClick={() => onChange(mode.id)}
        >
          <span className={styles.optionIcon}>{mode.icon}</span>
          <span className={styles.optionLabel}>{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

export default TerritoryViewSwitcher;
