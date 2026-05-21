import { createContext, useContext, useMemo, useState } from 'react';

export const PAGE_META = {
  home: {
    title: 'Главная',
    breadcrumb: 'TURBOWELCOME / ГЛАВНАЯ',
  },
  onboarding: {
    title: 'Адаптация',
    breadcrumb: 'TURBOWELCOME / АДАПТАЦИЯ',
  },
  organization: {
    title: 'Организация',
    breadcrumb: 'TURBOWELCOME / ОРГАНИЗАЦИЯ',
  },
  glossary: {
    title: 'Словарь терминов',
    breadcrumb: 'TURBOWELCOME / СЛОВАРЬ ТЕРМИНОВ',
  },
  profile: {
    title: 'Профиль',
    breadcrumb: 'TURBOWELCOME / ПРОФИЛЬ',
  },
  settings: {
    title: 'Настройки',
    breadcrumb: 'TURBOWELCOME / НАСТРОЙКИ',
  },
  users: {
    title: 'Пользователи',
    breadcrumb: 'TURBOWELCOME / ПОЛЬЗОВАТЕЛИ',
  },
  'new-employees': {
    title: 'Новые сотрудники',
    breadcrumb: 'TURBOWELCOME / НОВЫЕ СОТРУДНИКИ',
  },
};

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');

  const value = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      navigateTo: setCurrentPage,
    }),
    [currentPage],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
