import api from './api';

export const fetchGalleryPhotos = async () => {
  const { data } = await api.get('/api/v1/organization/gallery/');
  return data;
};

export const uploadGalleryPhoto = async (file, title = '') => {
  const formData = new FormData();
  formData.append('image', file);
  if (title.trim()) {
    formData.append('title', title.trim());
  }

  const { data } = await api.post('/api/v1/organization/gallery/', formData, {
    transformRequest: [(payload, headers) => {
      if (payload instanceof FormData) {
        delete headers['Content-Type'];
      }
      return payload;
    }],
  });
  return data;
};

export const updateGalleryPhoto = async (photoId, { title }) => {
  const { data } = await api.patch(`/api/v1/organization/gallery/${photoId}/`, { title });
  return data;
};

export const deleteGalleryPhoto = async (photoId) => {
  await api.delete(`/api/v1/organization/gallery/${photoId}/`);
};
