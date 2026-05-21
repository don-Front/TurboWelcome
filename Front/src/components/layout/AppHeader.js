import styles from './AppHeader.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getInitials(user) {
  const first = user?.first_name?.[0] || '';
  const last = user?.last_name?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function getAvatarUrl(user) {
  if (!user?.avatar) return null;
  if (user.avatar.startsWith('http')) return user.avatar;
  const path = user.avatar.startsWith('/') ? user.avatar : `/${user.avatar}`;
  return `${API_BASE}${path}`;
}

function AppHeader({ user, title, breadcrumb }) {
  const avatarUrl = getAvatarUrl(user);
  const displayName = user?.first_name || user?.full_name || 'Пользователь';

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.breadcrumb}>{breadcrumb}</div>
        <div className={styles.titleRow}>
          <div className={styles.titleIcon}>◉</div>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      <div className={styles.headerRight}>
        <button type="button" className={styles.notifyBtn} aria-label="Уведомления">
          🔔
          <span className={styles.notifyBadge}>0</span>
        </button>

        <div className={styles.userChip}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{getInitials(user)}</div>
          )}
          <span className={styles.nickname}>{displayName}</span>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
