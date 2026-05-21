import { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../../context/AuthContext';

function parseLoginError(err) {
  const data = err.response?.data;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data[0];
  if (data?.non_field_errors) return data.non_field_errors[0];
  if (data?.detail) return data.detail;
  return 'Неверный email или пароль';
}

function LoginForm({ onSwitchToRegister }) {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password, rememberMe);
    } catch (err) {
      setError(parseLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className={styles.formEyebrow}>SECURE ACCESS</span>
      <h2 className={styles.formTitle} id="auth-modal-title">Вход в TurboWelcome</h2>
      <p className={styles.formSubtitle}>
        Введите корпоративный email и пароль для доступа к платформе адаптации.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Email или логин</span>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoComplete="email"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <div className={styles.passwordWrap}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formFooter}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Запомнить меня</span>
          </label>
          <button type="button" className={styles.textLink} onClick={onSwitchToRegister}>
            Создать аккаунт
          </button>
        </div>

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти в рабочий центр'}
        </button>
      </form>
    </>
  );
}

export default LoginForm;
