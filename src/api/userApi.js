import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch list of users.
 * @param {number} limit - number of records to fetch (default 30)
 * @param {number} skip - pagination offset
 */
export const fetchUsersApi = async (limit = 30, skip = 0) => {
  const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
  return response.data;
};

/**
 * Fetch a single user by ID.
 * @param {string|number} id
 */
export const fetchUserByIdApi = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Add a new user.
 * DummyJSON mock endpoint: /users/add
 * @param {object} userData
 */
export const createUserApi = async (userData) => {
  const response = await api.post('/users/add', userData);
  return response.data;
};

/**
 * Update an existing user.
 * DummyJSON mock endpoint: /users/{id}
 * @param {string|number} id
 * @param {object} userData
 */
export const updateUserApi = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete a user.
 * DummyJSON mock endpoint: /users/{id}
 * @param {string|number} id
 */
export const deleteUserApi = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default api;
