import { useState } from 'react';
import GalleryViewSwitcher from '../features/organization/GalleryViewSwitcher';
import PhotoGallery from '../features/organization/PhotoGallery';
import TerritorySchemes from '../features/organization/TerritorySchemes';
import TerritoryViewSwitcher from '../features/organization/TerritoryViewSwitcher';
import styles from './OrganizationPage.module.css';

const SECTIONS = [
  { id: 'gallery', label: 'Фотогалерея' },
  { id: 'maps', label: 'Схемы территорий' },
];

function OrganizationPage() {
  const [activeSection, setActiveSection] = useState('gallery');
  const [galleryView, setGalleryView] = useState('grid');
  const [territoryView, setTerritoryView] = useState('popup');

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

      {activeSection === 'gallery' && (
        <GalleryViewSwitcher value={galleryView} onChange={setGalleryView} />
      )}

      {activeSection === 'maps' && (
        <TerritoryViewSwitcher value={territoryView} onChange={setTerritoryView} />
      )}

      <div
        className={`${styles.content} ${activeSection === 'gallery' || activeSection === 'maps' ? styles.contentGallery : ''}`}
        role="tabpanel"
      >
        {activeSection === 'gallery' ? (
          <PhotoGallery viewMode={galleryView} />
        ) : (
          <TerritorySchemes viewMode={territoryView} />
        )}
      </div>
    </div>
  );
}

export default OrganizationPage;
