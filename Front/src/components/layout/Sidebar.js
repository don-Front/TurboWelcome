import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { getRoleLabel } from '../../services/authService';
import LogoIcon from '../brand/LogoIcon';
import NavIcon from './NavIcons';
import styles from './Sidebar.module.css';

const WORK_NAV = {
  title: 'РАБОЧИЙ КОНТУР',
  items: [
    { id: 'home', label: 'Главная', hint: 'Обзор и быстрый доступ', icon: 'home' },
    { id: 'onboarding', label: 'Адаптация', hint: 'Программы и шаги', icon: 'onboarding' },
    { id: 'organization', label: 'Организация', hint: 'Фотогалерея и схемы', icon: 'organization' },
    { id: 'glossary', label: 'Словарь терминов', hint: 'Определения и понятия', icon: 'glossary' },
  ],
};

function getSystemNavItems(role) {
  const items = [
    { id: 'profile', label: 'Профиль', hint: 'Личные данные', icon: 'profile' },
  ];

  if (role === 'ADM') {
    items.push({
      id: 'users',
      label: 'Пользователи',
      hint: 'Все пользователи системы',
      icon: 'users',
    });
  }

  if (role === 'HR') {
    items.push({
      id: 'new-employees',
      label: 'Новые сотрудники',
      hint: 'Сотрудники на адаптации',
      icon: 'new-employees',
    });
  }

  items.push({
    id: 'settings',
    label: 'Настройки',
    hint: 'Интерфейс и уведомления',
    icon: 'settings',
  });

  return items;
}

function Sidebar({ user }) {
  const { logoutUser } = useAuth();
  const { currentPage, navigateTo } = useNavigation();

  const navSections = useMemo(
    () => [
      WORK_NAV,
      {
        title: 'СИСТЕМА',
        items: getSystemNavItems(user?.role),
      },
    ],
    [user?.role],
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <LogoIcon />
        <div>
          <div className={styles.logoTitle}>TurboWelcome</div>
          <div className={styles.logoSubtitle}>Платформа адаптации</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <div className={styles.navSectionTitle}>{section.title}</div>
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${currentPage === item.id ? styles.navItemActive : ''}`}
                onClick={() => navigateTo(item.id)}
              >
                <NavIcon name={item.icon || item.id} active={currentPage === item.id} />
                <span className={styles.navText}>
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={styles.navHint}>{item.hint}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.roleBadge}>{getRoleLabel(user?.role)}</div>
        <button type="button" className={styles.logoutBtn} onClick={logoutUser}>
          <span className={styles.logoutIcon}>⎋</span>
          Выход
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
