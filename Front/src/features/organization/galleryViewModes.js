export const GALLERY_VIEW_MODES = [
  {
    id: 'grid',
    label: 'Сетка',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'mosaic',
    label: 'Мозаика',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="15" y="11" width="6" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="15" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'slider',
    label: 'Слайдер',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 9h2v6h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 10.5 11 12l-3 1.5V10.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'filmstrip',
    label: 'Лента',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="8" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="9" y="8" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="16" y="8" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'spotlight',
    label: 'Акцент',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="17" y="3" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="17" y="10" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3" y="17" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'columns',
    label: 'Колонки',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="10" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="17" y="4" width="4" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export function getMosaicSizeClass(index) {
  const pattern = index % 6;
  if (pattern === 0) return 'mosaicLg';
  if (pattern === 3) return 'mosaicWide';
  if (pattern === 1 || pattern === 4) return 'mosaicSm';
  return 'mosaicMd';
}

export function getSpotlightSizeClass(index) {
  if (index === 0) return 'spotlightHero';
  if (index <= 2) return 'spotlightSide';
  return 'spotlightRow';
}
