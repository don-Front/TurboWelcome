import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearTokens,
  clearUser,
  fetchProfile,
  getStoredUser,
  login,
  logout as clearAuth,
  register,
  saveTokens,
  saveUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        saveUser(profile);
        setUser(profile);
      } catch {
        clearTokens();
        clearUser();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    restoreSession();
  }, []);

  const completeAuth = useCallback((data) => {
    saveTokens(data.tokens);
    saveUser(data.user);
    setUser(data.user);
  }, []);

  const loginUser = useCallback(async (email, password, rememberMe = false) => {
    const data = await login(email, password);
    completeAuth(data);

    if (rememberMe) {
      sessionStorage.removeItem('sessionOnly');
    } else {
      sessionStorage.setItem('sessionOnly', '1');
    }

    return data.user;
  }, [completeAuth]);

  const registerUser = useCallback(async (payload) => {
    const data = await register(payload);
    completeAuth(data);
    sessionStorage.removeItem('sessionOnly');
    return data.user;
  }, [completeAuth]);

  const logoutUser = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const setUserFromProfile = useCallback((profile) => {
    saveUser(profile);
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      loginUser,
      registerUser,
      logoutUser,
      setUserFromProfile,
    }),
    [user, initializing, loginUser, registerUser, logoutUser, setUserFromProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
