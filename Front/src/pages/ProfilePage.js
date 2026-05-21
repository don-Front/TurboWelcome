import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProfile,
  getRoleLabel,
  getStoredUser,
  updateProfile,
  uploadAvatar,
} from '../services/authService';
import styles from './ProfilePage.module.css';
import UploadIcon from '../components/profile/AvatarHoverIcons';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EDITABLE_FIELDS = ['first_name', 'last_name', 'phone', 'position'];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getInitials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase() || '?';
}

function getAvatarUrl(user) {
  if (!user?.avatar) return null;
  if (user.avatar.startsWith('http')) return user.avatar;
  const path = user.avatar.startsWith('/') ? user.avatar : `/${user.avatar}`;
  return `${API_BASE}${path}`;
}

function profileToForm(user) {
  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    position: user.position || '',
  };
}

function formsEqual(a, b) {
  if (!a || !b) return true;
  return EDITABLE_FIELDS.every((key) => (a[key] || '') === (b[key] || ''));
}

function getFieldErrors(error) {
  const data = error?.response?.data;
  if (!data) return null;

  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;

  const messages = Object.entries(data)
    .flatMap(([field, value]) => {
      const label = Array.isArray(value) ? value.join(', ') : String(value);
      return [`${field}: ${label}`];
    });

  return messages.join(' · ') || 'Не удалось сохранить изменения';
}

function ProfilePage() {
  const { user, setUserFromProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [savedHint, setSavedHint] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const applyProfile = useCallback((profile) => {
    const snapshot = profileToForm(profile);
    setForm(snapshot);
    setBaseline(snapshot);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchProfile();
        if (cancelled) return;
        setUserFromProfile(profile);
        applyProfile(profile);
      } catch {
        if (cancelled) return;
        const cached = getStoredUser();
        if (cached) applyProfile(cached);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [applyProfile, setUserFromProfile]);

  const isDirty = useMemo(
    () => Boolean(form && baseline && !formsEqual(form, baseline)),
    [form, baseline],
  );

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSavedHint(false);
  };

  const handleSave = async () => {
    if (!form || !isDirty) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        position: form.position.trim(),
      };

      const updated = await updateProfile(payload);
      setUserFromProfile(updated);
      applyProfile(updated);
      setSavedHint(true);
    } catch (err) {
      setError(getFieldErrors(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (!uploadingAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Выберите файл изображения');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);
    setError(null);
    setSavedHint(false);

    try {
      const updated = await uploadAvatar(file);
      setUserFromProfile(updated);
      setAvatarPreview(null);
      setSavedHint(true);
    } catch (err) {
      setAvatarPreview(null);
      setError(getFieldErrors(err) || 'Не удалось загрузить фото');
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingAvatar(false);
    }
  };

  if (!user || !form) return null;

  const avatarUrl = avatarPreview || getAvatarUrl(user);
  const displayName = `${form.first_name} ${form.last_name}`.trim() || user.full_name;

  const readOnlyFields = [
    { label: 'Email', value: user.email },
    { label: 'Роль', value: getRoleLabel(user.role), accent: true },
    { label: 'Отдел', value: user.department_name || '—' },
    { label: 'Дата найма', value: formatDate(user.hire_date) },
    { label: 'Дата регистрации', value: formatDate(user.date_joined) },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.heroCard}>
        <div className={styles.avatarWrap}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            aria-label="Загрузить фото профиля"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>
                {getInitials(form.first_name, form.last_name)}
              </div>
            )}
            <span className={`${styles.avatarOverlay} ${uploadingAvatar ? styles.avatarOverlayVisible : ''}`}>
              {uploadingAvatar ? (
                <span className={styles.avatarLoader} />
              ) : (
                <UploadIcon className={styles.avatarIcon} />
              )}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.avatarInput}
            onChange={handleAvatarChange}
          />
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.heroInfo}>
          <span className={styles.eyebrow}>ЛИЧНЫЙ ПРОФИЛЬ</span>
          <h2 className={styles.name}>{displayName}</h2>
          <p className={styles.meta}>
            {form.position || 'Сотрудник'}
            {user.department_name ? ` · ${user.department_name}` : ''}
          </p>
          <span className={styles.roleChip}>{getRoleLabel(user.role)}</span>
        </div>
      </div>

      {loading && <p className={styles.loadingHint}>Обновление данных...</p>}
      {savedHint && !isDirty && (
        <p className={styles.successHint}>Изменения сохранены</p>
      )}
      {error && <p className={styles.errorHint}>{error}</p>}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Личные данные</h3>
        <div className={styles.grid}>
          <label className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Имя</span>
            <input
              type="text"
              className={styles.input}
              value={form.first_name}
              onChange={handleChange('first_name')}
              autoComplete="given-name"
            />
          </label>
          <label className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Фамилия</span>
            <input
              type="text"
              className={styles.input}
              value={form.last_name}
              onChange={handleChange('last_name')}
              autoComplete="family-name"
            />
          </label>
          <label className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Телефон</span>
            <input
              type="tel"
              className={styles.input}
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+7 (999) 000-00-00"
              autoComplete="tel"
            />
          </label>
          <label className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Должность</span>
            <input
              type="text"
              className={styles.input}
              value={form.position}
              onChange={handleChange('position')}
              placeholder="Ваша должность"
              autoComplete="organization-title"
            />
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Системная информация</h3>
        <div className={styles.grid}>
          {readOnlyFields.map((field) => (
            <div key={field.label} className={styles.fieldCard}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <span className={`${styles.fieldValue} ${field.accent ? styles.fieldAccent : ''}`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isDirty && (
        <div className={styles.saveBar}>
          <span className={styles.saveHint}>Есть несохранённые изменения</span>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
