import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.welcome}>
      <h2 className={styles.welcomeTitle}>
        Добро пожаловать, {user.full_name}!
      </h2>
      <p className={styles.welcomeText}>
        Вы успешно вошли в TurboWelcome. Контент раздела появится здесь.
      </p>
    </div>
  );
}

export default HomePage;
