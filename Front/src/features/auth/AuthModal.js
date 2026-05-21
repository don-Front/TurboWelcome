import { useState } from 'react';
import styles from './AuthModal.module.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthModal() {
  const [mode, setMode] = useState('login');

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className={styles.modal}>
        <div className={styles.modalTop}>
          <div className={styles.modalBrand}>
            <div className={styles.logoIcon}>⚡</div>
            <span className={styles.logoText}>TurboWelcome</span>
          </div>
        </div>

        <div className={styles.modalBody}>
          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
