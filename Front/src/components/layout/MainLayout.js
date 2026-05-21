import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import styles from './MainLayout.module.css';

function MainLayout({ children, title, breadcrumb }) {
  const { user } = useAuth();

  return (
    <div className={styles.layout}>
      <Sidebar user={user} />
      <div className={styles.main}>
        <AppHeader
          user={user}
          title={title}
          breadcrumb={breadcrumb}
        />
        <div className={styles.content}>
          <div className={styles.contentInner}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
