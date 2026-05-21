import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import AuthenticatedApp from './components/AppRouter';
import AuthModal from './features/auth/AuthModal';
import styles from './App.module.css';

function AppContent() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.shell}>
      {isAuthenticated ? (
        <NavigationProvider>
          <AuthenticatedApp />
        </NavigationProvider>
      ) : null}
      {!isAuthenticated && <AuthModal />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
