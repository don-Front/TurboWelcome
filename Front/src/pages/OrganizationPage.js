import { useState } from 'react';
import styles from './OrganizationPage.module.css';

const SECTIONS = [
  { id: 'gallery', label: 'Фотогалерея' },
  { id: 'maps', label: 'Схемы территорий' },
];

const SECTION_CONTENT = {
  gallery: {
    title: 'Фотогалерея',
    text: 'Фото офисов, мероприятий и команды. Раздел в разработке.',
  },
  maps: {
    title: 'Схемы территорий',
    text: 'Планы этажей, навигация по офисам и производственным площадкам. Раздел в разработке.',
  },
};

function OrganizationPage() {
  const [activeSection, setActiveSection] = useState('gallery');
  const content = SECTION_CONTENT[activeSection];

  return (
    <div className={styles.page}>
      <div className={styles.subNav} role="tablist" aria-label="Разделы организации">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection === section.id}
            className={`${styles.subNavItem} ${activeSection === section.id ? styles.subNavItemActive : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className={styles.content} role="tabpanel">
        <span className={styles.badge}>Скоро</span>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.text}>{content.text}</p>
      </div>
    </div>
  );
}

export default OrganizationPage;
