import styles from './LogoIcon.module.css';

function OrbitIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <filter id="orbitGradGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="14" stroke="url(#orbitGrad)" strokeWidth="1.2" opacity="0.5" />
      <circle cx="20" cy="20" r="9" stroke="url(#orbitGrad)" strokeWidth="1.4" opacity="0.75" />
      <circle cx="20" cy="20" r="4.5" fill="url(#orbitGrad)" filter="url(#orbitGradGlow)" />
      <circle cx="30" cy="14" r="2" fill="#00d1ff" />
      <circle cx="12" cy="26" r="1.5" fill="#c084fc" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <div className={styles.logoIcon} role="img" aria-label="Логотип TurboWelcome">
      <OrbitIcon />
    </div>
  );
}

export default LogoIcon;
