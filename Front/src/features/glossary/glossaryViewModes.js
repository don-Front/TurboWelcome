export const GLOSSARY_VIEW_MODES = [
  {
    id: 'table',
    label: 'Таблица',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 9h18M3 14h18M10 9v11" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'cards',
    label: 'Карточки',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="4" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="16" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="16" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'Список',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 7h13M8 12h13M8 17h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="4.5" cy="7" r="1.5" fill="currentColor" />
        <circle cx="4.5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="4.5" cy="17" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'chips',
    label: 'Чипы',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="10" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="15" y="6" width="6" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="13" width="7" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="12" y="13" width="9" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'split',
    label: 'Сплит',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13 8h8M13 12h8M13 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];
