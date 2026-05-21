import api from './api';

export const fetchAllUsers = async (page = 1) => {
  const { data } = await api.get('/api/v1/auth/users/', { params: { page } });
  return data;
};

export const fetchNewEmployees = async (page = 1) => {
  const { data } = await api.get('/api/v1/auth/users/new/', { params: { page } });
  return data;
};

export const createNewEmployee = async (payload) => {
  const { data } = await api.post('/api/v1/auth/users/new/', payload);
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post('/api/v1/auth/users/', payload);
  return data;
};

export const fetchDepartments = async () => {
  const { data } = await api.get('/api/v1/auth/departments/');
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.patch(`/api/v1/auth/users/${id}/`, payload);
  return data;
};

export const deleteUser = async (id) => {
  await api.delete(`/api/v1/auth/users/${id}/`);
};

export const updateNewEmployee = async (id, payload) => {
  const { data } = await api.patch(`/api/v1/auth/users/new/${id}/`, payload);
  return data;
};

export const deleteNewEmployee = async (id) => {
  await api.delete(`/api/v1/auth/users/new/${id}/`);
};
