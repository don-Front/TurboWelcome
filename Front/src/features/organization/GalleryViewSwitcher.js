import styles from './GalleryViewSwitcher.module.css';
import { GALLERY_VIEW_MODES } from './galleryViewModes';

function GalleryViewSwitcher({ value, onChange }) {
  return (
    <div className={styles.switcher} role="radiogroup" aria-label="Вид представления галереи">
      {GALLERY_VIEW_MODES.map((mode) => (
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

export default GalleryViewSwitcher;
