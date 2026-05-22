import { useState } from 'react';
import authStyles from '../auth/AuthModal.module.css';
import styles from './TerritorySchemes.module.css';
import TerritoryMap from './TerritoryMap';
import {
  TERRITORY_INTRO,
  TERRITORY_TABLE_COLUMNS,
  TERRITORY_TABLE_ROWS,
} from './territoryData';

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7h9a4 4 0 0 1 0 8H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7 7l3-3M7 7l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IntroBlock({ compact = false }) {
  return (
    <div className={`${styles.introBlock} ${compact ? styles.introBlockCompact : ''}`}>
      <span className={styles.kicker}>База «Спектр»</span>
      <div className={styles.introText}>
        {TERRITORY_INTRO.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function TerritoryTable() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {TERRITORY_TABLE_COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TERRITORY_TABLE_ROWS.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className={authStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${authStyles.modal} ${styles.mapModal}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="territory-map-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.kicker}>Схема территории</span>
            <h3 id="territory-map-title" className={styles.modalTitle}>База «Спектр»</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <TerritoryMap />
      </div>
    </div>
  );
}

function PopupMode() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <div className={styles.popupLayout}>
        <div className={styles.popupHeader}>
          <IntroBlock />
          <button type="button" className={styles.primaryAction} onClick={() => setMapOpen(true)}>
            <span><MapIcon /></span>
            Показать схему
          </button>
        </div>
        <TerritoryTable />
      </div>
      <MapModal open={mapOpen} onClose={() => setMapOpen(false)} />
    </>
  );
}

function CardMode() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`${styles.flipPanel} ${flipped ? styles.flipPanelFlipped : ''}`}>
      <div className={styles.flipPanelInner}>
        <div className={styles.flipFace}>
          <div className={styles.popupHeader}>
            <IntroBlock />
            <button type="button" className={styles.primaryAction} onClick={() => setFlipped(true)}>
              <span><RotateIcon /></span>
              Перевернуть к схеме
            </button>
          </div>
          <TerritoryTable />
        </div>

        <div className={`${styles.flipFace} ${styles.flipBackFace}`}>
          <div className={styles.modalHeader}>
            <div>
              <span className={styles.kicker}>Оборот карточки</span>
              <h3 className={styles.modalTitle}>Схема территории базы «Спектр»</h3>
            </div>
            <button type="button" className={styles.primaryAction} onClick={() => setFlipped(false)}>
              <span><RotateIcon /></span>
              К таблице
            </button>
          </div>
          <TerritoryMap />
        </div>
      </div>
    </div>
  );
}

function SplitMode() {
  return (
    <div className={styles.splitLayout}>
      <section className={styles.splitMain}>
        <IntroBlock compact />
        <TerritoryTable />
      </section>
      <aside className={styles.mapAside}>
        <div className={styles.asideHeader}>
          <span className={styles.kicker}>Навигация</span>
          <h3>Схема базы</h3>
        </div>
        <TerritoryMap />
      </aside>
    </div>
  );
}

function TerritorySchemes({ viewMode }) {
  if (viewMode === 'card') {
    return <CardMode />;
  }

  if (viewMode === 'split') {
    return <SplitMode />;
  }

  return <PopupMode />;
}

export default TerritorySchemes;
