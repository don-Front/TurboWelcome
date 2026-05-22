import { useState } from 'react';
import GlossaryViewSwitcher from '../features/glossary/GlossaryViewSwitcher';
import { GLOSSARY_SECTION_TITLE, GLOSSARY_TERMS } from '../features/glossary/glossaryData';
import styles from './GlossaryPage.module.css';

function SectionHeader() {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.kicker}>Корпоративный словарь</span>
      <h2 className={styles.sectionTitle}>{GLOSSARY_SECTION_TITLE}</h2>
    </div>
  );
}

function TableView() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Сокращение</th>
            <th>Расшифровка</th>
          </tr>
        </thead>
        <tbody>
          {GLOSSARY_TERMS.map((term) => (
            <tr key={term.abbr} className={styles.tableRow}>
              <td className={styles.abbrCell}>{term.abbr}</td>
              <td>{term.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardsView() {
  return (
    <div className={styles.cardsGrid}>
      {GLOSSARY_TERMS.map((term) => (
        <article key={term.abbr} className={styles.termCard}>
          <div className={styles.termCardTop}>
            <span className={styles.termBadge}>{term.abbr}</span>
            <h3 className={styles.termCardTitle}>{term.title}</h3>
          </div>
          <p className={styles.termCardDesc}>{term.description}</p>
        </article>
      ))}
    </div>
  );
}

function ListView() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.list}>
      {GLOSSARY_TERMS.map((term) => {
        const isOpen = expanded === term.abbr;
        return (
          <div
            key={term.abbr}
            className={`${styles.listItem} ${isOpen ? styles.listItemOpen : ''}`}
          >
            <button
              type="button"
              className={styles.listTrigger}
              onClick={() => setExpanded(isOpen ? null : term.abbr)}
              aria-expanded={isOpen}
            >
              <span className={styles.listAbbr}>{term.abbr}</span>
              <span className={styles.listTitle}>{term.title}</span>
              <span className={styles.listChevron}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p className={styles.listDesc}>{term.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChipsView() {
  const [active, setActive] = useState(GLOSSARY_TERMS[0].abbr);
  const selected = GLOSSARY_TERMS.find((t) => t.abbr === active) || GLOSSARY_TERMS[0];

  return (
    <div className={styles.chipsLayout}>
      <div className={styles.chipsRow} role="tablist" aria-label="Сокращения">
        {GLOSSARY_TERMS.map((term) => (
          <button
            key={term.abbr}
            type="button"
            role="tab"
            aria-selected={active === term.abbr}
            className={`${styles.chip} ${active === term.abbr ? styles.chipActive : ''}`}
            onClick={() => setActive(term.abbr)}
          >
            {term.abbr}
          </button>
        ))}
      </div>
      <article className={styles.chipDetail} role="tabpanel">
        <span className={styles.termBadge}>{selected.abbr}</span>
        <h3 className={styles.chipDetailTitle}>{selected.title}</h3>
        <p className={styles.chipDetailDesc}>{selected.description}</p>
      </article>
    </div>
  );
}

function SplitView() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(GLOSSARY_TERMS[0].abbr);
  const active = GLOSSARY_TERMS.find((t) => t.abbr === (hovered || selected)) || GLOSSARY_TERMS[0];

  return (
    <div className={styles.splitLayout}>
      <div className={styles.splitTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Сокращение</th>
              <th>Расшифровка</th>
            </tr>
          </thead>
          <tbody>
            {GLOSSARY_TERMS.map((term) => (
              <tr
                key={term.abbr}
                className={`${styles.tableRow} ${styles.tableRowClickable} ${active.abbr === term.abbr ? styles.tableRowActive : ''}`}
                onMouseEnter={() => setHovered(term.abbr)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(term.abbr)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(term.abbr);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={active.abbr === term.abbr}
              >
                <td className={styles.abbrCell}>{term.abbr}</td>
                <td>{term.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside className={styles.splitDetail}>
        <span className={styles.kicker}>Подробнее</span>
        <span className={styles.termBadge}>{active.abbr}</span>
        <h3 className={styles.splitDetailTitle}>{active.title}</h3>
        <p className={styles.splitDetailDesc}>{active.description}</p>
      </aside>
    </div>
  );
}

const VIEW_COMPONENTS = {
  table: TableView,
  cards: CardsView,
  list: ListView,
  chips: ChipsView,
  split: SplitView,
};

function GlossaryPage() {
  const [viewMode, setViewMode] = useState('table');
  const ViewComponent = VIEW_COMPONENTS[viewMode] || TableView;

  return (
    <div className={styles.page}>
      <GlossaryViewSwitcher value={viewMode} onChange={setViewMode} />

      <div className={styles.content}>
        <SectionHeader />
        <ViewComponent />
      </div>
    </div>
  );
}

export default GlossaryPage;
