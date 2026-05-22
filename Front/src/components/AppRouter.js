import MainLayout from './layout/MainLayout';
import { PAGE_META, useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import PlaceholderPage from '../pages/PlaceholderPage';
import GlossaryPage from '../pages/GlossaryPage';
import OrganizationPage from '../pages/OrganizationPage';
import ProfilePage from '../pages/ProfilePage';
import UsersPage from '../pages/UsersPage';

const PLACEHOLDER_PAGES = new Set(['onboarding', 'settings']);

function canAccessPage(pageId, role) {
  if (pageId === 'users') return role === 'ADM';
  if (pageId === 'new-employees') return role === 'HR';
  return true;
}

function renderPageContent(currentPage, role) {
  if (!canAccessPage(currentPage, role)) {
    return <HomePage />;
  }

  if (currentPage === 'profile') {
    return <ProfilePage />;
  }

  if (currentPage === 'users') {
    return <UsersPage mode="all" />;
  }

  if (currentPage === 'new-employees') {
    return <UsersPage mode="new" />;
  }

  if (currentPage === 'home') {
    return <HomePage />;
  }

  if (currentPage === 'organization') {
    return <OrganizationPage />;
  }

  if (currentPage === 'glossary') {
    return <GlossaryPage />;
  }

  if (PLACEHOLDER_PAGES.has(currentPage)) {
    return <PlaceholderPage pageId={currentPage} />;
  }

  return <HomePage />;
}

function AuthenticatedApp() {
  const { currentPage } = useNavigation();
  const { user } = useAuth();
  const role = user?.role;
  const safePage = canAccessPage(currentPage, role) ? currentPage : 'home';
  const pageMeta = PAGE_META[safePage] || PAGE_META.home;

  return (
    <MainLayout title={pageMeta.title} breadcrumb={pageMeta.breadcrumb}>
      {renderPageContent(currentPage, role)}
    </MainLayout>
  );
}

export default AuthenticatedApp;
