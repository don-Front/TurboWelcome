import styles from './NavIcons.module.css';

const ICON_PATHS = {
  home: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  onboarding: (
    <>
      <path d="M9 6h10" />
      <path d="M9 12h10" />
      <path d="M9 18h6" />
      <path d="M5 6l1.5 1.5L5 9" />
      <path d="M5 12l1.5 1.5L5 15" />
      <path d="M5 18l1.5 1.5L5 21" />
    </>
  ),
  organization: (
    <>
      <path d="M4 21V7l8-4 8 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
    </>
  ),
  glossary: (
    <>
      <path d="M6 4h8a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3V4z" />
      <path d="M6 16a3 3 0 0 0 3 3" />
      <path d="M18 7h1a2 2 0 0 1 2 2v11H9" />
      <path d="M10 8h4" />
      <path d="M10 12h3" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 20c.5-2.5 2.5-4 5-4 1.2 0 2.2.3 3 .8" />
    </>
  ),
  'new-employees': (
    <>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M4 20c0-3.3 2.9-6 6.5-6" />
      <path d="M18 8v6" />
      <path d="M15 11h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </>
  ),
};

function NavIcon({ name, active = false }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.home;

  return (
    <span className={`${styles.iconWrap} ${active ? styles.iconWrapActive : ''}`}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths}
      </svg>
    </span>
  );
}

export default NavIcon;
