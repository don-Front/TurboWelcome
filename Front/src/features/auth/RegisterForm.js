import { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../../context/AuthContext';

function RegisterForm({ onSwitchToLogin }) {
  const { registerUser } = useAuth();
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    phone: '',
    position: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      await registerUser(form);
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const fieldErrors = {};
        Object.entries(data).forEach(([key, value]) => {
          fieldErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(fieldErrors);
      } else if (typeof data === 'string') {
        setGeneralError(data);
      } else if (Array.isArray(data)) {
        setGeneralError(data[0]);
      } else {
        setGeneralError('Не удалось зарегистрироваться. Попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span className={styles.formEyebrow}>НОВЫЙ АККАУНТ</span>
      <h2 className={styles.formTitle} id="auth-modal-title">Регистрация в TurboWelcome</h2>
      <p className={styles.formSubtitle}>
        Создайте аккаунт нового сотрудника и начните программу адаптации.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.label}>Имя</span>
            <input
              className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
              value={form.first_name}
              onChange={handleChange('first_name')}
              placeholder="Иван"
              required
            />
            {errors.first_name && <span className={styles.fieldError}>{errors.first_name}</span>}
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Фамилия</span>
            <input
              className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
              value={form.last_name}
              onChange={handleChange('last_name')}
              placeholder="Петров"
              required
            />
            {errors.last_name && <span className={styles.fieldError}>{errors.last_name}</span>}
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="name@company.com"
            required
            autoComplete="email"
          />
          {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
        </label>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.label}>Телефон</span>
            <input
              className={styles.input}
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+7 (999) 000-00-00"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Должность</span>
            <input
              className={styles.input}
              value={form.position}
              onChange={handleChange('position')}
              placeholder="Junior Developer"
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <div className={styles.passwordWrap}>
            <input
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Минимум 8 символов"
              required
              autoComplete="new-password"
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
          {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Подтверждение пароля</span>
          <input
            className={`${styles.input} ${errors.password_confirm ? styles.inputError : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={form.password_confirm}
            onChange={handleChange('password_confirm')}
            placeholder="Повторите пароль"
            required
            autoComplete="new-password"
          />
          {errors.password_confirm && (
            <span className={styles.fieldError}>{errors.password_confirm}</span>
          )}
        </label>

        {generalError && <p className={styles.error}>{generalError}</p>}

        <div className={styles.formFooterCenter}>
          <span className={styles.footerText}>Уже есть аккаунт?</span>
          <button type="button" className={styles.textLink} onClick={onSwitchToLogin}>
            Войти
          </button>
        </div>

        <button type="submit" className={styles.secondaryBtn} disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </>
  );
}

export default RegisterForm;
