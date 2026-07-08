import React, { createContext, useContext } from 'react';

// Auth has been disabled — this app currently has no login/backend.
// This stub keeps the same shape as the original AuthContext so any
// component still calling useAuth() won't crash. It always reports
// "not authenticated" and its actions are no-ops.
//
// If you add real auth later (Firebase, Supabase, your own backend, etc.),
// replace the values/functions below with real implementations.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const value = {
    user: null,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    authChecked: true,
    logout: () => {},
    navigateToLogin: () => {},
    checkUserAuth: async () => {},
    checkAppState: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};