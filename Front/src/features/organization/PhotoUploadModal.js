import { useCallback, useEffect, useRef, useState } from 'react';
import authStyles from '../auth/AuthModal.module.css';
import styles from './PhotoUploadModal.module.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;

function validateFile(file) {
  if (!file) return 'Выберите файл';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Допустимые форматы: JPG, PNG, WEBP, GIF';
  }
  if (file.size > MAX_SIZE) {
    return 'Размер файла не должен превышать 10 МБ';
  }
  return null;
}

function PhotoUploadModal({ open, onClose, onUpload }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setDragOver(false);
      setUploading(false);
      setError(null);
    }
  }, [open]);

  const handleUpload = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await onUpload(file);
      onClose();
    } catch (err) {
      const data = err?.response?.data;
      const message = data?.image?.[0] || data?.detail || 'Не удалось загрузить фото';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setUploading(false);
    }
  }, [onClose, onUpload]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleUpload(file);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  if (!open) return null;

  return (
    <div className={authStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${authStyles.modal} ${styles.modal}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-upload-title"
      >
        <div className={styles.header}>
          <h3 id="photo-upload-title" className={styles.title}>Добавить фото</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div
          className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''} ${uploading ? styles.dropZoneDisabled : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              if (!uploading) inputRef.current?.click();
            }
          }}
        >
          <span className={styles.dropIcon}>+</span>
          <span className={styles.dropTitle}>
            {uploading ? 'Загрузка…' : 'Нажмите или перетащите фото'}
          </span>
          <span className={styles.dropHint}>JPG, PNG, WEBP, GIF · до 10 МБ</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.fileInput}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default PhotoUploadModal;
