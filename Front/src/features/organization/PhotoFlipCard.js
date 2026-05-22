import { useEffect, useRef, useState } from 'react';
import styles from './PhotoGallery.module.css';

function PencilIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 19h4l9.8-9.8a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L5 15v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5 17.5 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 7l1 13h8l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 10v6M14 10v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhotoFlipCard({
  photo,
  imageUrl,
  onUpdate,
  onDelete,
  sizeClass = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [titleDraft, setTitleDraft] = useState(photo.title || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);

  const hasTitle = Boolean(photo.title?.trim());
  const isFlipped = isEditing || isHovered;

  useEffect(() => {
    setTitleDraft(photo.title || '');
  }, [photo.title]);

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const startEditing = (event) => {
    event.stopPropagation();
    setIsHovered(true);
    setIsEditing(true);
    focusInput();
  };

  const handleBlur = async () => {
    const trimmed = titleDraft.trim();
    const saved = (photo.title || '').trim();

    if (trimmed !== saved) {
      try {
        await onUpdate(photo.id, { title: trimmed });
      } catch {
        setTitleDraft(photo.title || '');
      }
    }

    setIsEditing(false);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(photo.id);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <article
      className={[
        styles.flipCard,
        sizeClass,
        isFlipped ? styles.flipped : '',
        isEditing ? styles.editing : '',
      ].filter(Boolean).join(' ')}
      onMouseEnter={() => {
        if (!isEditing) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.flipInner}>
        <div className={styles.flipFront}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={photo.title || 'Фото организации'}
              className={styles.photoImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.photoFallback}>Нет превью</div>
          )}
        </div>

        <div className={styles.flipBack}>
          <div className={styles.backToolbar}>
            {(hasTitle || isEditing) && (
              <button
                type="button"
                className={styles.backPencilBtn}
                onClick={startEditing}
                aria-label="Редактировать подпись"
              >
                <PencilIcon className={styles.pencilIconSmall} />
              </button>
            )}
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Удалить фото"
            >
              <TrashIcon className={styles.actionIcon} />
            </button>
          </div>

          <div className={`${styles.backContent} ${isEditing ? styles.backContentEditing : ''}`}>
            {isEditing ? (
              <textarea
                ref={inputRef}
                className={styles.titleInputFull}
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={handleBlur}
                placeholder="Подпись к фото"
                maxLength={200}
              />
            ) : hasTitle ? (
              <p className={styles.titleText}>{photo.title}</p>
            ) : (
              <button
                type="button"
                className={styles.centerPencilBtn}
                onClick={startEditing}
                aria-label="Добавить подпись"
              >
                <PencilIcon className={styles.pencilIconLarge} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PhotoFlipCard;
