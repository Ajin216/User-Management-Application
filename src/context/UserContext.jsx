import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchUsersApi,
  fetchUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from '../api/userApi';

const UserContext = createContext(null);

const STORAGE_KEY = 'userpulse_local_users';
const INITIAL_FETCHED_KEY = 'userpulse_initialized';

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (err) {
        console.error('Failed to sync users to localStorage', err);
      }
    }
  }, [users]);

  // Initial load from DummyJSON API if not already saved in state
  const loadInitialUsers = useCallback(async (force = false) => {
    if (!force && users.length > 0) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch 30 users to provide a rich dataset for sorting/filtering/pagination
      const data = await fetchUsersApi(30, 0);
      setUsers(data.users || []);
      localStorage.setItem(INITIAL_FETCHED_KEY, 'true');
    } catch (err) {
      console.error('Error fetching users from DummyJSON:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [users.length]);

  useEffect(() => {
    const initialized = localStorage.getItem(INITIAL_FETCHED_KEY);
    if (!initialized || users.length === 0) {
      loadInitialUsers();
    }
  }, [loadInitialUsers, users.length]);

  /**
   * Reset local state back to fresh DummyJSON API data
   */
  const resetToApiData = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersApi(30, 0);
      setUsers(data.users || []);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.users || []));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new user:
   * 1. Submits POST /users/add to DummyJSON
   * 2. Adds the returned user to local state array at the beginning
   */
  const addUser = async (userData) => {
    try {
      const payload = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        age: Number(userData.age),
        email: userData.email.trim(),
        gender: userData.gender || 'other',
        phone: userData.phone?.trim() || '',
        birthDate: userData.birthDate || '',
        bloodGroup: userData.bloodGroup || 'O+',
        height: userData.height ? Number(userData.height) : 175,
        weight: userData.weight ? Number(userData.weight) : 70,
        address: {
          address: userData.address || '123 Innovation Way',
          city: userData.city || 'Tech City',
          state: userData.state || 'California',
          postalCode: userData.postalCode || '90210',
          country: 'United States',
        },
        company: {
          name: userData.company || 'Global Tech Inc.',
          title: userData.title || 'Software Engineer',
          department: userData.department || 'Engineering',
        },
        ip: userData.ip || '192.168.1.100',
        macAddress: userData.macAddress || '00:1B:44:11:3A:B7',
      };

      let createdUser;
      try {
        createdUser = await createUserApi(payload);
      } catch (apiErr) {
        console.warn('API create failed, generating local fallback', apiErr);
        // Fallback for offline or API mock limits
        createdUser = {
          ...payload,
          id: Date.now(),
        };
      }

      // Ensure consistent image avatar
      const username = `${createdUser.firstName?.toLowerCase() || 'user'}${Math.floor(Math.random() * 100)}`;
      const enrichedUser = {
        ...payload,
        ...createdUser,
        id: createdUser.id || Date.now(),
        image:
          createdUser.image && createdUser.image.length > 5
            ? createdUser.image
            : `https://dummyjson.com/icon/${username}/128`,
      };

      // Prepend to local state so user sees it right at top
      setUsers((prev) => [enrichedUser, ...prev]);
      return enrichedUser;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Update an existing user:
   * 1. Submits PUT /users/{id} to DummyJSON
   * 2. Updates local state array immediately
   */
  const updateUser = async (id, updatedFields) => {
    const numericId = Number(id);
    const existingIndex = users.findIndex((u) => u.id === numericId || String(u.id) === String(id));
    const existing = existingIndex !== -1 ? users[existingIndex] : null;

    let apiResult = null;
    try {
      // Execute PUT request as required by API specification
      apiResult = await updateUserApi(id, updatedFields);
    } catch (apiErr) {
      // Mock API limitation: User IDs created client-side or > 208 do not exist on the server database
      console.warn(`DummyJSON mock PUT notice for ID ${id}: Using local state persistence.`, apiErr?.message);
    }

    // Merge existing user record with updated fields and API result
    const mergedUser = {
      ...(existing || {}),
      ...(apiResult || {}),
      ...updatedFields,
      id: existing ? existing.id : numericId || id,
      age: updatedFields.age !== undefined ? Number(updatedFields.age) : existing?.age,
      // Retain or construct address/company sub-objects safely
      address: {
        ...(existing?.address || {}),
        address: updatedFields.address !== undefined ? updatedFields.address : existing?.address?.address || '',
        city: updatedFields.city !== undefined ? updatedFields.city : existing?.address?.city || '',
        state: updatedFields.state !== undefined ? updatedFields.state : existing?.address?.state || '',
        postalCode: updatedFields.postalCode !== undefined ? updatedFields.postalCode : existing?.address?.postalCode || '',
        country: existing?.address?.country || 'United States',
      },
      company: {
        ...(existing?.company || {}),
        name: updatedFields.company !== undefined ? updatedFields.company : existing?.company?.name || '',
        title: updatedFields.title !== undefined ? updatedFields.title : existing?.company?.title || '',
        department: updatedFields.department !== undefined ? updatedFields.department : existing?.company?.department || '',
      },
    };

    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === numericId || String(u.id) === String(id));
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = mergedUser;
        return copy;
      }
      return [mergedUser, ...prev];
    });

    return mergedUser;
  };

  /**
   * Delete a user from state & call API
   */
  const deleteUser = async (id) => {
    try {
      await deleteUserApi(id);
    } catch (apiErr) {
      console.warn(`DummyJSON mock DELETE notice for ID ${id}: User removed from local state.`, apiErr?.message);
    }

    setUsers((prev) => prev.filter((u) => u.id !== Number(id) && String(u.id) !== String(id)));
    return true;
  };

  /**
   * Look up user by ID (checks local state first, then DummyJSON API)
   */
  const getUserById = async (id) => {
    const stringId = String(id);
    const localUser = users.find((u) => String(u.id) === stringId);
    if (localUser) {
      return localUser;
    }

    // If not in local memory, try fetching from server
    try {
      const serverUser = await fetchUserByIdApi(id);
      return serverUser;
    } catch (err) {
      console.error(`User with ID ${id} not found in state or server:`, err);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        loadInitialUsers,
        resetToApiData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
