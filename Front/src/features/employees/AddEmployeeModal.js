import { useEffect, useState } from 'react';
import { ROLE_LABELS } from '../../services/authService';
import {
  createNewEmployee,
  createUser,
  fetchDepartments,
  updateNewEmployee,
  updateUser,
} from '../../services/userService';
import authStyles from '../auth/AuthModal.module.css';
import styles from './AddEmployeeModal.module.css';

const ROLE_OPTIONS = ['ADM', 'HR', 'MGR', 'NEW'];

const MODAL_COPY = {
  admin: {
    eyebrow: 'АДМИНИСТРИРОВАНИЕ',
    title: 'Новый пользователь',
    subtitle: 'Создайте аккаунт и назначьте роль в системе.',
    submit: 'Добавить пользователя',
    error: 'Не удалось добавить пользователя. Попробуйте снова.',
  },
  hr: {
    eyebrow: 'HR-КОНТУР',
    title: 'Новый сотрудник',
    subtitle: 'Заполните данные сотрудника. Аккаунт будет создан с ролью «Новый сотрудник».',
    submit: 'Добавить сотрудника',
    error: 'Не удалось добавить сотрудника. Попробуйте снова.',
  },
};

const EDIT_COPY = {
  admin: {
    eyebrow: 'АДМИНИСТРИРОВАНИЕ',
    title: 'Редактировать пользователя',
    subtitle: 'Измените данные пользователя и сохраните.',
    submit: 'Сохранить изменения',
    error: 'Не удалось сохранить изменения. Попробуйте снова.',
  },
  hr: {
    eyebrow: 'HR-КОНТУР',
    title: 'Редактировать сотрудника',
    subtitle: 'Измените данные нового сотрудника.',
    submit: 'Сохранить изменения',
    error: 'Не удалось сохранить изменения. Попробуйте снова.',
  },
};

function getEmptyForm(variant) {
  return {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    position: '',
    department: '',
    hire_date: '',
    role: variant === 'admin' ? 'NEW' : '',
    password: '',
    password_confirm: '',
  };
}

function userToForm(user, variant) {
  return {
    email: user.email || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    position: user.position || '',
    department: user.department ? String(user.department) : '',
    hire_date: user.hire_date || '',
    role: user.role || (variant === 'admin' ? 'NEW' : ''),
    password: '',
    password_confirm: '',
  };
}

function AddEmployeeModal({ variant = 'hr', initialUser = null, onClose, onCreated }) {
  const isEdit = Boolean(initialUser);
  const copy = isEdit ? EDIT_COPY[variant] : MODAL_COPY[variant];
  const isAdmin = variant === 'admin';

  const [form, setForm] = useState(() => (
    initialUser ? userToForm(initialUser, variant) : getEmptyForm(variant)
  ));
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(Array.isArray(data) ? data : []);
      } catch {
        setDepartments([]);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setGeneralError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        position: form.position.trim(),
      };

      if (form.department) {
        payload.department = Number(form.department);
      } else if (isEdit) {
        payload.department = null;
      }

      if (form.hire_date) {
        payload.hire_date = form.hire_date;
      } else if (isEdit) {
        payload.hire_date = null;
      }

      if (isEdit) {
        if (isAdmin) {
          payload.email = form.email.trim();
          payload.role = form.role;
          await updateUser(initialUser.id, payload);
        } else {
          await updateNewEmployee(initialUser.id, payload);
        }
      } else {
        payload.email = form.email.trim();
        payload.password = form.password;
        payload.password_confirm = form.password_confirm;

        if (isAdmin) {
          payload.role = form.role;
          await createUser(payload);
        } else {
          await createNewEmployee(payload);
        }
      }

      onCreated();
      onClose();
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
      } else {
        setGeneralError(copy.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={authStyles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-employee-title"
      onClick={onClose}
    >
      <div
        className={`${authStyles.modal} ${styles.modalWide}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={authStyles.modalTop}>
          <div className={styles.modalHeader}>
            <div>
              <span className={authStyles.formEyebrow}>{copy.eyebrow}</span>
              <h2 className={authStyles.formTitle} id="add-employee-title">
                {copy.title}
              </h2>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
              ×
            </button>
          </div>
          <p className={authStyles.formSubtitle}>{copy.subtitle}</p>
        </div>

        <div className={authStyles.modalBody}>
          <form className={authStyles.form} onSubmit={handleSubmit}>
            <div className={authStyles.fieldRow}>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Имя</span>
                <input
                  className={`${authStyles.input} ${errors.first_name ? authStyles.inputError : ''}`}
                  value={form.first_name}
                  onChange={handleChange('first_name')}
                  placeholder="Иван"
                  required
                />
                {errors.first_name && (
                  <span className={authStyles.fieldError}>{errors.first_name}</span>
                )}
              </label>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Фамилия</span>
                <input
                  className={`${authStyles.input} ${errors.last_name ? authStyles.inputError : ''}`}
                  value={form.last_name}
                  onChange={handleChange('last_name')}
                  placeholder="Петров"
                  required
                />
                {errors.last_name && (
                  <span className={authStyles.fieldError}>{errors.last_name}</span>
                )}
              </label>
            </div>

            <label className={authStyles.field}>
              <span className={authStyles.label}>Email</span>
              <input
                className={`${authStyles.input} ${errors.email ? authStyles.inputError : ''}`}
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="name@company.com"
                required={!isEdit || isAdmin}
                readOnly={isEdit && !isAdmin}
                autoComplete="off"
              />
              {errors.email && <span className={authStyles.fieldError}>{errors.email}</span>}
            </label>

            {isAdmin && (
              <label className={authStyles.field}>
                <span className={authStyles.label}>Роль</span>
                <select
                  className={`${authStyles.input} ${errors.role ? authStyles.inputError : ''}`}
                  value={form.role}
                  onChange={handleChange('role')}
                  required
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                  ))}
                </select>
                {errors.role && <span className={authStyles.fieldError}>{errors.role}</span>}
              </label>
            )}

            <div className={authStyles.fieldRow}>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Телефон</span>
                <input
                  className={authStyles.input}
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="+7 (999) 000-00-00"
                />
              </label>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Должность</span>
                <input
                  className={authStyles.input}
                  value={form.position}
                  onChange={handleChange('position')}
                  placeholder="Junior Developer"
                />
              </label>
            </div>

            <div className={authStyles.fieldRow}>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Отдел</span>
                <select
                  className={authStyles.input}
                  value={form.department}
                  onChange={handleChange('department')}
                >
                  <option value="">Не выбран</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </label>
              <label className={authStyles.field}>
                <span className={authStyles.label}>Дата найма</span>
                <input
                  className={authStyles.input}
                  type="date"
                  value={form.hire_date}
                  onChange={handleChange('hire_date')}
                />
              </label>
            </div>

            {!isEdit && (
              <>
            <label className={authStyles.field}>
              <span className={authStyles.label}>Пароль</span>
              <div className={authStyles.passwordWrap}>
                <input
                  className={`${authStyles.input} ${errors.password ? authStyles.inputError : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Минимум 8 символов"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={authStyles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className={authStyles.fieldError}>{errors.password}</span>}
            </label>

            <label className={authStyles.field}>
              <span className={authStyles.label}>Подтверждение пароля</span>
              <input
                className={`${authStyles.input} ${errors.password_confirm ? authStyles.inputError : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={form.password_confirm}
                onChange={handleChange('password_confirm')}
                placeholder="Повторите пароль"
                required
                autoComplete="new-password"
              />
              {errors.password_confirm && (
                <span className={authStyles.fieldError}>{errors.password_confirm}</span>
              )}
            </label>
              </>
            )}

            {generalError && <p className={authStyles.error}>{generalError}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className={authStyles.secondaryBtn} disabled={loading}>
                {loading ? 'Сохранение...' : copy.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployeeModal;
