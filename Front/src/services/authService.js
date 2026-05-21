import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/api/v1/auth/login/', { email, password });
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post('/api/v1/auth/register/', {
    ...payload,
    role: 'NEW',
  });
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get('/api/v1/auth/me/');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch('/api/v1/auth/me/', payload);
  return data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await api.patch('/api/v1/auth/me/', formData, {
    transformRequest: [(payload, headers) => {
      if (payload instanceof FormData) {
        delete headers['Content-Type'];
      }
      return payload;
    }],
  });
  return data;
};

export const saveTokens = (tokens) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem('user');
};

export const logout = () => {
  clearTokens();
  clearUser();
  sessionStorage.removeItem('sessionOnly');
};

export const ROLE_LABELS = {
  ADM: 'Админ',
  HR: 'HR-менеджер',
  MGR: 'Руководитель',
  NEW: 'Новый сотрудник',
};

export const getRoleLabel = (role) => ROLE_LABELS[role] || role;
