import { useCallback, useEffect, useState } from 'react';
import {
  deleteGalleryPhoto,
  fetchGalleryPhotos,
  updateGalleryPhoto,
  uploadGalleryPhoto,
} from '../../services/galleryService';
import {
  getMosaicSizeClass,
  getSpotlightSizeClass,
} from './galleryViewModes';
import PhotoFlipCard from './PhotoFlipCard';
import PhotoUploadModal from './PhotoUploadModal';
import styles from './PhotoGallery.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const VIEW_CLASS = {
  grid: styles.galleryGrid,
  mosaic: styles.galleryMosaic,
  slider: styles.gallerySlider,
  filmstrip: styles.galleryFilmstrip,
  spotlight: styles.gallerySpotlight,
  columns: styles.galleryColumns,
};

function resolveImageUrl(photo) {
  const url = photo?.image_url || photo?.image;
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${path}`;
}

function getCardSizeClass(viewMode, index) {
  if (viewMode === 'mosaic') {
    return styles[getMosaicSizeClass(index)];
  }
  if (viewMode === 'spotlight') {
    return styles[getSpotlightSizeClass(index)];
  }
  return '';
}

function AddPhotoButton({ compact, onClick, viewMode }) {
  const viewAddClass = {
    slider: styles.addBtnSlider,
    filmstrip: styles.addBtnFilmstrip,
    spotlight: styles.addBtnSpotlight,
    mosaic: styles.addBtnMosaic,
    columns: styles.addBtnColumns,
  }[viewMode];

  return (
    <button
      type="button"
      className={[
        styles.addBtn,
        compact ? styles.addBtnCompact : styles.addBtnLarge,
        viewAddClass,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label="Добавить фото"
    >
      <span className={styles.addIcon}>+</span>
    </button>
  );
}

function PhotoGallery({ viewMode = 'grid' }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadPhotos = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchGalleryPhotos();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Не удалось загрузить фотогалерею');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleUpload = async (file) => {
    const photo = await uploadGalleryPhoto(file);
    setPhotos((prev) => [photo, ...prev]);
  };

  const handleUpdatePhoto = async (photoId, { title }) => {
    const updated = await updateGalleryPhoto(photoId, { title });
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, ...updated } : photo)),
    );
  };

  const handleDeletePhoto = async (photoId) => {
    await deleteGalleryPhoto(photoId);
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  if (loading) {
    return (
      <div className={styles.stateBox}>
        <p className={styles.stateText}>Загрузка фотогалереи…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateBox}>
        <p className={styles.stateText}>{error}</p>
        <button type="button" className={styles.retryBtn} onClick={loadPhotos}>
          Повторить
        </button>
      </div>
    );
  }

  const isEmpty = photos.length === 0;
  const galleryClass = VIEW_CLASS[viewMode] || VIEW_CLASS.grid;

  return (
    <>
      <div className={`${styles.gallery} ${galleryClass} ${isEmpty ? styles.galleryEmpty : ''}`}>
        {photos.map((photo, index) => (
          <PhotoFlipCard
            key={photo.id}
            photo={photo}
            imageUrl={resolveImageUrl(photo)}
            onUpdate={handleUpdatePhoto}
            onDelete={handleDeletePhoto}
            sizeClass={getCardSizeClass(viewMode, index)}
          />
        ))}

        <AddPhotoButton
          compact={!isEmpty}
          viewMode={viewMode}
          onClick={() => setModalOpen(true)}
        />
      </div>

      <PhotoUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
}

export default PhotoGallery;
